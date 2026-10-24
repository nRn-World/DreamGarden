import { create } from 'zustand';
import type { DecoId, PlantId, SaveState, Settings, SpiritId } from './types';
import { ACHIEVEMENTS, CHAPTERS } from './content/progression';
import { DECORATIONS } from './content/spirits';
import { PLANTS } from './content/plants';
import {
  applyXp,
  applyXpResult,
  availableChapter,
  bondRequirement,
  bonusesFor,
  canFulfillOrder,
  dailyAvailableAt,
  dailyReward,
  dailyStreakOnClaim,
  growthDuration,
  growthOf,
  harvestPlant,
  localDateKey,
  makeOrders,
  moonwellCharges,
  nextGoalKey,
  offerToSpirit,
  planNight,
  sleepNight,
  plotUnlockInfo,
  sellCrops,
  syncLevelUnlocks,
  levelUnlockKeys,
  createNewSave,
  achievementProgress,
} from './engine';
import { clearSave, exportSave, importSave as parseSave, loadSave, saveGame } from './save';
import { audio, haptic } from './audio';
import { detectLocale, formatDuration, isLocale, makeT, translate, type DictKey } from '../i18n';

export type Screen = 'garden' | 'seeds' | 'wishes' | 'spirits' | 'journal';
export type JournalTab = 'story' | 'achievements' | 'stats' | 'settings';

export type Sheet =
  | { kind: 'seed'; plot: number }
  | { kind: 'plant'; plot: number }
  | { kind: 'plot'; plot: number }
  | { kind: 'spirit'; id: SpiritId }
  | { kind: 'settings' }
  | { kind: 'daily' }
  | { kind: 'offline' }
  | { kind: 'story'; index: number }
  | { kind: 'book' }
  | { kind: 'night' }
  | { kind: 'achievements' }
  | { kind: 'basket' }
  | { kind: 'credits' }
  | { kind: 'privacy' }
  | null;

export type ToastIcon = 'dew' | 'stardust' | 'spirit' | 'leaf' | 'gift' | 'book' | 'check' | 'warn';

export interface Toast {
  id: number;
  text: string;
  icon: ToastIcon;
  tone: 'good' | 'info' | 'warn';
}

interface BootInfo {
  recovered: boolean;
  fresh: boolean;
}

let toastId = 0;
let saveTimer: ReturnType<typeof setTimeout> | null = null;

const clone = (save: SaveState): SaveState => JSON.parse(JSON.stringify(save)) as SaveState;

function scheduleSave(save: SaveState): void {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    saveGame(save);
    saveTimer = null;
  }, 500);
}

function hydrateDocument(locale: string, settings: Settings): void {
  if (typeof document === 'undefined') return;
  const html = document.documentElement;
  html.lang = locale;
  html.dir = locale === 'ar' ? 'rtl' : 'ltr';
  html.dataset.text = settings.largeText ? 'large' : 'normal';
  html.dataset.motion = settings.reducedMotion ? 'reduced' : 'full';
}

export interface GameState {
  save: SaveState;
  now: number;
  loaded: boolean;
  boot: BootInfo;
  screen: Screen;
  journalTab: JournalTab;
  sheet: Sheet;
  toasts: Toast[];
  levelUp: number | null;
  welcomeBack: { awayMs: number; ripe: number } | null;
  lastReward: { dew: number; stardust: number } | null;

  init: () => void;
  tick: () => void;
  go: (screen: Screen) => void;
  setJournalTab: (tab: JournalTab) => void;
  openSheet: (sheet: Sheet) => void;
  closeSheet: () => void;
  notify: (text: string, icon?: ToastIcon, tone?: Toast['tone']) => void;
  dismissToast: (id: number) => void;
  dismissLevelUp: () => void;
  dismissWelcomeBack: () => void;

  plant: (plot: number, plant: PlantId) => boolean;
  water: (plot: number) => void;
  harvest: (plot: number) => void;
  boost: (plot: number) => void;
  compost: (plot: number) => void;
  unlockPlot: (plot: number) => void;
  sell: (plant: PlantId, count: number) => void;
  sellAll: () => void;
  fulfilOrder: (orderId: string) => void;
  refreshOrders: () => void;
  feedSpirit: (spirit: SpiritId, plant: PlantId) => void;
  toggleEquip: (spirit: SpiritId) => void;
  buyDecoration: (id: DecoId) => void;
  togglePlaceDecoration: (id: DecoId) => void;
  claimAchievement: (id: string) => void;
  claimDaily: () => void;
  readChapter: (index: number) => void;
  countTale: () => void;
  sleep: () => void;
  completeOnboarding: (locale: string) => void;
  advanceTutorial: (step: number) => void;
  nextTutorial: () => void;
  finishTutorial: () => void;
  setSettings: (patch: Partial<Settings>) => void;
  setLocale: (locale: string) => void;
  resetGarden: () => void;
  exportGarden: () => void;
  importGarden: (text: string) => void;
}

export const useGame = create<GameState>((set, get) => {
  const t = (key: DictKey, vars?: Record<string, string | number>) => {
    const save = get().save;
    return translate(save.locale ?? 'en', key, vars);
  };
  const dur = (ms: number) => {
    const save = get().save;
    return formatDuration(ms, save.locale ?? 'en', makeT(save.locale ?? 'en'));
  };

  const notify = (text: string, icon: ToastIcon = 'leaf', tone: Toast['tone'] = 'good') => {
    const id = ++toastId;
    // Keep the stack short: a tall pile of toasts hides the HUD and the sheet
    // header underneath it. Two is enough to confirm what just happened.
    set((s) => ({ toasts: [...s.toasts.slice(-1), { id, text, icon, tone }] }));
    setTimeout(() => get().dismissToast(id), 3000);
  };

  const applySettings = (save: SaveState) => {
    audio.configure({ sound: save.settings.sound, music: save.settings.music });
    hydrateDocument(save.locale ?? 'en', save.settings);
  };

  const afterLevelChange = (save: SaveState, previousLevel: number) => {
    const unlockedKeys = syncLevelUnlocks(save);
    if (save.level > previousLevel) {
      audio.sfx('level');
      haptic([12, 60, 18], save.settings.haptics);
      set({ levelUp: save.level });
      for (let lvl = previousLevel + 1; lvl <= save.level; lvl += 1) {
        for (const key of levelUnlockKeys(lvl)) {
          const [kind, id] = key.split('.');
          const name =
            kind === 'plant'
              ? t(`plant.${id}.name` as DictKey)
              : kind === 'spirit'
                ? t(`spirit.${id}.name` as DictKey)
                : t(`deco.${id}.name` as DictKey);
          const label = kind === 'spirit' ? 'unlock.spirit' : kind === 'deco' ? 'unlock.deco' : 'unlock.plant';
          notify(t(label as DictKey, { name }), kind === 'spirit' ? 'spirit' : 'leaf', 'info');
        }
      }
    }
    return unlockedKeys;
  };

  const commit = (save: SaveState, extra?: Partial<GameState>) => {
    set({ save, ...extra });
  };

  return {
    save: createNewSave(Date.now()),
    now: Date.now(),
    loaded: false,
    boot: { recovered: false, fresh: true },
    screen: 'garden',
    journalTab: 'story',
    sheet: null,
    toasts: [],
    levelUp: null,
    welcomeBack: null,
    lastReward: null,

    init: () => {
      if (get().loaded) return;
      const now = Date.now();
      const result = loadSave(now);
      const save = clone(result.save);
      const awayMs = save.lastSeen > 0 ? now - save.lastSeen : 0;
      const activePlanted = save.plots.filter((p) => p.plant).length;
      const ripe = save.plots.filter((p) => {
        if (!p.plant) return false;
        const def = PLANTS[p.plant.species];
        return growthOf(def, p.plant.plantedAt, p.plant.watered, now, bonusesFor(save)).ripe;
      }).length;
      syncLevelUnlocks(save);
      planNight(save, now);
      save.lastSeen = now;
      audio.setTrack(save.nightsCleared);
      audio.configure({ sound: save.settings.sound, music: save.settings.music });
      hydrateDocument(save.locale ?? detectLocale(), save.settings);
      set({
        save,
        now,
        loaded: true,
        boot: { recovered: result.recovered, fresh: result.fresh },
        welcomeBack:
          save.onboarded && awayMs > 8 * 60 * 1000 && activePlanted > 0 ? { awayMs, ripe } : null,
        levelUp: null,
      });
      scheduleSave(save);
    },

    tick: () => {
      if (!get().loaded) return;
      const now = Date.now();
      if (get().save.night.date !== localDateKey(now)) {
        const save = clone(get().save);
        planNight(save, now);
        commit(save, { now });
        return;
      }
      set({ now });
    },

    go: (screen) => {
      set({ screen, sheet: null });
      const save = get().save;
      haptic(6, save.settings.haptics);
    },

    setJournalTab: (journalTab) => set({ journalTab }),

    openSheet: (sheet) => {
      audio.sfx('open');
      set({ sheet });
    },
    closeSheet: () => set({ sheet: null }),

    notify,

    dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((toast) => toast.id !== id) })),
    dismissLevelUp: () => set({ levelUp: null }),
    dismissWelcomeBack: () => set({ welcomeBack: null }),

    plant: (plotIndex, plantId) => {
      const save = clone(get().save);
      const plot = save.plots[plotIndex];
      const def = PLANTS[plantId];
      if (!plot || !def) return false;
      if (!plot.unlocked) return false;
      if (plot.plant) return false;
      if (!save.unlockedPlants.includes(plantId) || save.level < def.unlockLevel) {
        notify(t('toast.lockedLevel', { level: def.unlockLevel }), 'warn', 'warn');
        audio.sfx('error');
        return false;
      }
      if (save.dew < def.seedCost) {
        notify(t('toast.notEnoughDew'), 'warn', 'warn');
        audio.sfx('error');
        return false;
      }
      save.dew -= def.seedCost;
      plot.plant = { species: plantId, plantedAt: Date.now(), watered: 0, totalWatered: 0 };
      save.stats.planted += 1;
      if (save.tutorial === 1) save.tutorial = 2;
      commit(save);
      audio.sfx('plant');
      haptic(8, save.settings.haptics);
      notify(t('toast.planted', { plant: t(`plant.${plantId}.name` as DictKey) }), 'leaf');
      return true;
    },

    water: (plotIndex) => {
      const save = clone(get().save);
      const plot = save.plots[plotIndex];
      if (!plot?.plant) return;
      const def = PLANTS[plot.plant.species];
      if (plot.plant.watered >= def.waterNeed) return;
      plot.plant.watered += 1;
      plot.plant.totalWatered += 1;
      save.stats.watered += 1;
      if (save.tutorial === 2) save.tutorial = 3;
      commit(save);
      audio.sfx('water');
      haptic(8, save.settings.haptics);
      notify(t('toast.watered'), 'leaf');
    },

    harvest: (plotIndex) => {
      const save = clone(get().save);
      const previousLevel = save.level;
      const name = save.plots[plotIndex]?.plant
        ? t(`plant.${save.plots[plotIndex]!.plant!.species}.name` as DictKey)
        : '';
      const result = harvestPlant(save, plotIndex, Date.now(), Math.random);
      if (!result) return;
      if (save.tutorial === 3) save.tutorial = 4;
      afterLevelChange(save, previousLevel);
      commit(save);
      audio.sfx('harvest');
      haptic([10, 30, 12], save.settings.haptics);
      notify(t('toast.harvested', { count: result.crops, plant: name }), 'leaf');
      if (result.stardust > 0) {
        setTimeout(() => notify(t('toast.stardust', { count: result.stardust }), 'stardust'), 500);
      }
    },

    boost: (plotIndex) => {
      const save = clone(get().save);
      const plot = save.plots[plotIndex];
      if (!plot?.plant) return;
      const now = Date.now();
      const free = moonwellCharges(save, now);
      if (free > 0) {
        save.moonwell = { date: localDateKey(now), charges: free - 1 };
      } else if (save.stardust >= 2) {
        save.stardust -= 2;
      } else {
        notify(t('toast.notEnoughStardust'), 'stardust', 'warn');
        audio.sfx('error');
        return;
      }
      const def = PLANTS[plot.plant.species];
      const duration = growthDuration(def, plot.plant.watered, bonusesFor(save));
      plot.plant.plantedAt = now - duration - 1000;
      save.stats.boostsUsed += 1;
      if (save.tutorial === 3) save.tutorial = 4;
      commit(save);
      audio.sfx('reward');
      notify(t('toast.boosted'), 'stardust');
    },

    compost: (plotIndex) => {
      const save = clone(get().save);
      const plot = save.plots[plotIndex];
      if (!plot?.plant) return;
      delete plot.plant;
      commit(save);
      set({ sheet: null });
      notify(t('toast.composted'), 'leaf');
    },

    unlockPlot: (plotIndex) => {
      const save = clone(get().save);
      const plot = save.plots[plotIndex];
      const info = plotUnlockInfo(save, plotIndex);
      if (!plot || plot.unlocked || !info) return;
      if (save.level < info.level) {
        notify(t('toast.lockedLevel', { level: info.level }), 'warn', 'warn');
        audio.sfx('error');
        return;
      }
      if (save.dew < info.cost) {
        notify(t('toast.notEnoughDew'), 'warn', 'warn');
        audio.sfx('error');
        return;
      }
      save.dew -= info.cost;
      plot.unlocked = true;
      commit(save);
      audio.sfx('reward');
      haptic([10, 40, 20], save.settings.haptics);
      notify(t('toast.plotUnlocked'), 'leaf');
    },

    sell: (plantId, count) => {
      const save = clone(get().save);
      const have = save.inventory[plantId] ?? 0;
      if (have <= 0) {
        notify(t('toast.noBasket'), 'warn', 'warn');
        return;
      }
      const sold = Math.max(0, Math.min(have, Math.floor(count)));
      const earned = sellCrops(save, plantId, sold);
      if (sold === 0 || earned === 0) return;
      if (save.tutorial === 4) save.tutorial = 5;
      commit(save);
      audio.sfx('claim');
      notify(
        t('toast.sold', { count: sold, plant: t(`plant.${plantId}.name` as DictKey), dew: earned }),
        'dew',
      );
      set({ lastReward: { dew: earned, stardust: 0 } });
    },

    sellAll: () => {
      const save = clone(get().save);
      let total = 0;
      let crops = 0;
      for (const id of Object.keys(save.inventory) as PlantId[]) {
        const count = save.inventory[id] ?? 0;
        if (count > 0) {
          const earned = sellCrops(save, id, count);
          total += earned;
          crops += count;
        }
      }
      if (total === 0) {
        notify(t('toast.noBasket'), 'warn', 'warn');
        return;
      }
      if (save.tutorial === 4) save.tutorial = 5;
      commit(save);
      audio.sfx('claim');
      notify(t('toast.soldAll', { count: crops, dew: total }), 'dew');
      set({ lastReward: { dew: total, stardust: 0 } });
    },

    fulfilOrder: (orderId) => {
      const save = clone(get().save);
      const order = save.orders.find((o) => o.id === orderId);
      if (!order || !canFulfillOrder(save, order)) return;
      const previousLevel = save.level;
      for (const item of order.items) {
        const left = (save.inventory[item.plant] ?? 0) - item.count;
        if (left > 0) save.inventory[item.plant] = left;
        else delete save.inventory[item.plant];
      }
      const bonuses = bonusesFor(save);
      const dew = Math.round(order.rewardDew * (1 + bonuses.orders));
      save.dew += dew;
      save.stardust += order.rewardStardust;
      save.stats.ordersDone += 1;
      save.stats.dewEarned += dew;
      save.ordersCompleted += 1;
      const xpResult = applyXp(save, order.rewardXp);
      applyXpResult(save, xpResult);
      if (save.tutorial === 5) {
        save.tutorial = 6;
        save.dew += 60;
        save.stardust += 1;
      }
      const [replacement] = makeOrders(save, Date.now(), Math.random);
      if (replacement) save.orders = save.orders.map((o) => (o.id === orderId ? replacement : o));
      afterLevelChange(save, previousLevel);
      commit(save);
      audio.sfx('reward');
      haptic([10, 40, 15], save.settings.haptics);
      notify(t('toast.wishFulfilled', { spirit: t(`spirit.${order.spirit}.name` as DictKey) }), 'spirit');
      setTimeout(() => notify(t('common.reward', { dew, stardust: order.rewardStardust }), 'dew'), 450);
    },

    refreshOrders: () => {
      const save = clone(get().save);
      const now = Date.now();
      save.orders = makeOrders(save, now, Math.random);
      save.ordersRefreshedAt = now;
      commit(save);
      audio.sfx('open');
      notify(t('toast.ordersRefreshed'), 'book', 'info');
    },

    feedSpirit: (spiritId, plantId) => {
      const save = clone(get().save);
      const before = save.spirits[spiritId]?.bond ?? 0;
      const used = offerToSpirit(save, spiritId, plantId, 9999);
      if (used <= 0) return;
      const after = save.spirits[spiritId]?.bond ?? before;
      commit(save);
      audio.sfx(after > before ? 'reward' : 'water');
      haptic(8, save.settings.haptics);
      notify(
        t('toast.offered', {
          count: used,
          plant: t(`plant.${plantId}.name` as DictKey),
          spirit: t(`spirit.${spiritId}.name` as DictKey),
        }),
        'spirit',
      );
      if (after > before) {
        setTimeout(
          () =>
            notify(
              t('toast.bondUp', { spirit: t(`spirit.${spiritId}.name` as DictKey), n: after }),
              'spirit',
            ),
          450,
        );
      }
    },

    toggleEquip: (spiritId) => {
      const save = clone(get().save);
      const spirit = save.spirits[spiritId];
      if (!spirit?.unlocked) return;
      if (save.equipped.includes(spiritId)) {
        save.equipped = save.equipped.filter((id) => id !== spiritId);
        commit(save);
        audio.sfx('tap');
        notify(t('toast.uninvited', { spirit: t(`spirit.${spiritId}.name` as DictKey) }), 'spirit', 'info');
        return;
      }
      if (save.equipped.length >= 3) {
        notify(t('toast.equipFull'), 'warn', 'warn');
        audio.sfx('error');
        return;
      }
      save.equipped = [...save.equipped, spiritId];
      commit(save);
      audio.sfx('reward');
      notify(t('toast.invited', { spirit: t(`spirit.${spiritId}.name` as DictKey) }), 'spirit');
    },

    buyDecoration: (id) => {
      const save = clone(get().save);
      const def = DECORATIONS[id];
      if (!def || save.decorations[id]) return;
      if (save.level < def.unlockLevel) {
        notify(t('toast.lockedLevel', { level: def.unlockLevel }), 'warn', 'warn');
        audio.sfx('error');
        return;
      }
      if (save.dew < def.cost) {
        notify(t('toast.notEnoughDew'), 'warn', 'warn');
        audio.sfx('error');
        return;
      }
      save.dew -= def.cost;
      save.decorations[id] = true;
      commit(save);
      audio.sfx('claim');
      notify(t('decor.buyToast', { name: t(`deco.${id}.name` as DictKey) }), 'leaf');
    },

    togglePlaceDecoration: (id) => {
      const save = clone(get().save);
      if (!save.decorations[id]) return;
      const placed = save.placedDecorations.includes(id);
      save.placedDecorations = placed
        ? save.placedDecorations.filter((d) => d !== id)
        : [...save.placedDecorations, id];
      save.flags.sawHarmony = true;
      commit(save);
      audio.sfx(placed ? 'tap' : 'plant');
      const key: DictKey = placed ? 'decor.removeToast' : 'decor.placeToast';
      notify(t(key, { name: t(`deco.${id}.name` as DictKey) }), 'leaf', placed ? 'info' : 'good');
    },

    claimAchievement: (id) => {
      const save = clone(get().save);
      const def = ACHIEVEMENTS.find((a) => a.id === id);
      if (!def || save.achievementsClaimed.includes(id)) return;
      const progress = achievementProgress(save, def);
      if (!progress.done) return;
      save.achievementsClaimed.push(id);
      save.dew += def.rewardDew;
      save.stardust += def.rewardStardust;
      save.stats.dewEarned += def.rewardDew;
      commit(save);
      audio.sfx('claim');
      haptic([10, 30, 10], save.settings.haptics);
      notify(t('toast.achievement', { name: t(`achievement.${id}.name` as DictKey) }), 'stardust');
    },

    claimDaily: () => {
      const now = Date.now();
      const save = clone(get().save);
      if (now < dailyAvailableAt(save)) {
        notify(t('toast.dailyWait', { time: dur(dailyAvailableAt(save) - now) }), 'warn', 'warn');
        return;
      }
      const streak = dailyStreakOnClaim(save, now);
      const reward = dailyReward(streak);
      save.daily = {
        lastClaim: now,
        streak,
        totalClaims: save.daily.totalClaims + 1,
      };
      save.stats.dailyMaxStreak = Math.max(save.stats.dailyMaxStreak, streak);
      save.dew += reward.dew;
      save.stardust += reward.stardust;
      save.stats.dewEarned += reward.dew;
      commit(save);
      audio.sfx('claim');
      haptic([10, 30, 10, 30, 20], save.settings.haptics);
      notify(t('toast.dailyClaimed', { dew: reward.dew }), 'gift');
      set({ lastReward: reward });
    },

    readChapter: (index) => {
      const save = clone(get().save);
      const chapter = CHAPTERS.find((c) => c.index === index);
      if (!chapter || save.level < chapter.unlockLevel) return;
      if (!save.chaptersRead.includes(index)) {
        save.chaptersRead.push(index);
        save.stats.chaptersRead = save.chaptersRead.length;
        save.lastChapterSeen = Math.max(save.lastChapterSeen, index);
        save.dew += chapter.rewardDew;
        save.stardust += chapter.rewardStardust;
        save.stats.dewEarned += chapter.rewardDew;
        commit(save);
        audio.sfx('reward');
        haptic([10, 40, 20], save.settings.haptics);
        notify(t('toast.chapterRead', { n: index }), 'book');
      } else {
        set({ sheet: { kind: 'story', index } });
      }
    },

    countTale: () => {
      const save = clone(get().save);
      save.stats.tales += 1;
      commit(save);
    },

    sleep: () => {
      const save = clone(get().save);
      const reward = sleepNight(save);
      if (!reward) return;
      commit(save, { lastReward: reward });
      audio.sfx('claim');
      audio.setTrack(save.nightsCleared);
      haptic([10, 40, 20], save.settings.haptics);
      notify(t('toast.nightCleared', { dew: reward.dew }), 'gift');
    },

    completeOnboarding: (locale) => {
      const save = clone(get().save);
      save.locale = isLocale(locale) ? locale : detectLocale();
      save.onboarded = true;
      save.tutorial = 1;
      commit(save);
      applySettings(save);
      audio.unlock();
    },

    advanceTutorial: (step) => {
      const save = clone(get().save);
      if (save.tutorial < step && save.tutorial < 6) {
        save.tutorial = step;
        scheduleSave(save);
        set({ save });
      }
    },

    nextTutorial: () => {
      const save = clone(get().save);
      if (save.tutorial >= 6) return;
      save.tutorial += 1;
      if (save.tutorial >= 6) {
        save.dew += 60;
        save.stardust += 1;
        set({ save });
        notify(t('tutorial.gift'), 'gift');
        audio.sfx('reward');
      } else {
        set({ save });
      }
    },

    finishTutorial: () => {
      const save = clone(get().save);
      if (save.tutorial >= 6) return;
      save.tutorial = 6;
      save.dew += 60;
      save.stardust += 1;
      commit(save);
      audio.sfx('reward');
      notify(t('tutorial.gift'), 'gift');
    },

    setSettings: (patch) => {
      const save = clone(get().save);
      save.settings = { ...save.settings, ...patch };
      commit(save);
      applySettings(save);
      if (patch.sound === true) audio.sfx('tap');
    },

    setLocale: (locale) => {
      if (!isLocale(locale)) return;
      const save = clone(get().save);
      save.locale = locale;
      commit(save);
      applySettings(save);
      audio.sfx('tap');
    },

    resetGarden: () => {
      const now = Date.now();
      const old = get().save;
      clearSave();
      const save = createNewSave(now, old.locale);
      save.onboarded = true;
      save.tutorial = 6;
      save.settings = old.settings;
      syncLevelUnlocks(save);
      commit(save, { sheet: null, levelUp: null, welcomeBack: null, toasts: [] });
      applySettings(save);
      notify(t('settings.resetDone'), 'leaf');
    },

    exportGarden: () => {
      const save = get().save;
      const text = exportSave(save);
      try {
        const blob = new Blob([text], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dream-garden-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 2000);
        notify(t('toast.exported'), 'check');
      } catch {
        notify(t('toast.error'), 'warn', 'warn');
      }
    },

    importGarden: (text) => {
      const parsed = parseSave(text);
      if (!parsed) {
        notify(t('toast.importFailed'), 'warn', 'warn');
        audio.sfx('error');
        return;
      }
      const save = clone(parsed);
      syncLevelUnlocks(save);
      commit(save, { sheet: null });
      applySettings(save);
      audio.sfx('claim');
      notify(t('toast.imported'), 'check');
    },
  };
});

useGame.subscribe((state, previous) => {
  if (state.loaded && state.save !== previous.save) scheduleSave(state.save);
});

if (typeof window !== 'undefined') {
  const flush = () => {
    const state = useGame.getState();
    if (!state.loaded) return;
    const save = { ...state.save, lastSeen: Date.now() };
    saveGame(save);
  };
  window.addEventListener('pagehide', flush);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush();
  });
}

export function goalText(save: SaveState, now: number): DictKey {
  return nextGoalKey(save, now) as DictKey;
}

export function chapterProgress(save: SaveState): { read: number; total: number } {
  return { read: save.chaptersRead.length, total: CHAPTERS.length };
}

export function equippedCount(save: SaveState): number {
  return save.equipped.length;
}

export function nextChapterFor(save: SaveState): number | null {
  const chapter = availableChapter(save);
  return chapter ? chapter.index : null;
}

export function bondText(save: SaveState, spirit: SpiritId): string {
  const state = save.spirits[spirit];
  const need = bondRequirement(state.bond);
  return `${state.essence} / ${need}`;
}
