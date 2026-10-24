import type {
  AchievementDef,
  Bonuses,
  ChapterDef,
  DecoId,
  HarvestResult,
  Order,
  PlantDef,
  PlantId,
  Progress,
  SaveState,
  SpiritId,
  SpiritState,
} from './types';
import { PLANTS, PLANT_ORDER, RARE_TIER } from './content/plants';
import { DECORATIONS, DECO_ORDER, MAX_BOND, MAX_EQUIPPED, SPIRITS, SPIRIT_ORDER, bondCost } from './content/spirits';
import {
  ACHIEVEMENTS,
  CHAPTERS,
  LEVEL_UNLOCKS,
  PLOT_UNLOCKS,
  STARTING_PLOTS,
  TOTAL_PLOTS,
  makePlots,
} from './content/progression';

export const SAVE_VERSION = 1;
export const DAY_MS = 24 * 60 * 60 * 1000;
export const MAX_LEVEL = 60;

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function localDateKey(now: number): string {
  const d = new Date(now);
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

export function levelXpNeeded(level: number): number {
  return Math.round(60 * Math.pow(level, 1.25));
}

/** Total XP needed to reach a level from level 1, for the journal display. */
export function totalXpForLevel(level: number): number {
  let sum = 0;
  for (let l = 1; l < level; l += 1) sum += levelXpNeeded(l);
  return sum;
}

export function emptySpiritState(): SpiritState {
  return { unlocked: false, bond: 1, essence: 0, offerings: 0 };
}

export function createNewSave(now: number, locale: string | null = null): SaveState {
  const save: SaveState = {
    version: SAVE_VERSION,
    createdAt: now,
    lastSeen: now,
    locale,
    onboarded: false,
    tutorial: 0,
    level: 1,
    xp: 0,
    dew: 90,
    stardust: 2,
    plots: makePlots(),
    inventory: {},
    unlockedPlants: ['dewbell', 'lumenlotus'],
    spirits: Object.fromEntries(SPIRIT_ORDER.map((id) => [id, emptySpiritState()])) as Record<
      SpiritId,
      SpiritState
    >,
    equipped: [],
    decorations: Object.fromEntries(DECO_ORDER.map((id) => [id, false])) as Record<DecoId, boolean>,
    placedDecorations: [],
    orders: [],
    ordersRefreshedAt: now,
    ordersCompleted: 0,
    achievementsClaimed: [],
    chaptersRead: [],
    lastChapterSeen: 0,
    daily: { lastClaim: 0, streak: 0, totalClaims: 0 },
    moonwell: { date: localDateKey(now), charges: 3 },
    settings: {
      sound: true,
      music: true,
      haptics: true,
      reducedMotion: false,
      largeText: false,
    },
    stats: {
      harvests: 0,
      harvestsByPlant: {},
      ordersDone: 0,
      spiritsBonded: 0,
      cropsSold: 0,
      dewEarned: 0,
      planted: 0,
      chaptersRead: 0,
      dailyMaxStreak: 0,
      boostsUsed: 0,
      rareHarvests: 0,
    },
    flags: { metSpirit: null, sawHarmony: false, harvestedFirst: false },
  };
  save.orders = makeOrders(save, now, Math.random);
  return save;
}

/* ------------------------------------------------------------------ */
/* Bonuses                                                             */
/* ------------------------------------------------------------------ */

export function harmonyOf(save: SaveState): number {
  return save.placedDecorations.reduce((sum, id) => sum + (DECORATIONS[id]?.harmony ?? 0), 0);
}

export function equippedSpirits(save: SaveState) {
  return save.equipped
    .slice(0, MAX_EQUIPPED)
    .map((id) => ({ def: SPIRITS[id], state: save.spirits[id] }))
    .filter((s) => s.def && s.state?.unlocked);
}

export function bonusesFor(save: SaveState): Bonuses {
  const bonuses: Bonuses = { dew: 0, growth: 0, yield: 0, stardust: 0, orders: 0, xp: 0 };
  for (const { def, state } of equippedSpirits(save)) {
    const value = def.power * clamp(state.bond, 1, MAX_BOND);
    bonuses[def.passive] += value;
  }
  bonuses.dew += harmonyOf(save) * 0.004;
  return bonuses;
}

export function dewMultiplier(save: SaveState): number {
  return 1 + bonusesFor(save).dew;
}

/* ------------------------------------------------------------------ */
/* Growth                                                              */
/* ------------------------------------------------------------------ */

export function growthDuration(def: PlantDef, watered: number, bonuses: Bonuses): number {
  const waterSpeed = 1 - 0.06 * clamp(watered, 0, def.waterNeed);
  return Math.max(5_000, (def.growMs * waterSpeed) / (1 + bonuses.growth));
}

export function growthOf(def: PlantDef, plantedAt: number, watered: number, now: number, bonuses: Bonuses): Progress {
  const durationMs = growthDuration(def, watered, bonuses);
  const elapsed = Math.max(0, now - plantedAt);
  const progress = clamp(elapsed / durationMs, 0, 1);
  let stage: Progress['stage'] = 0;
  if (progress >= 0.86) stage = 3;
  else if (progress >= 0.46) stage = 2;
  else if (progress >= 0.18) stage = 1;
  return {
    progress,
    ripe: progress >= 1,
    remainingMs: Math.max(0, durationMs - elapsed),
    stage,
    durationMs,
  };
}

export function emptyPlotCount(save: SaveState): number {
  return save.plots.filter((p) => p.unlocked && !p.plant).length;
}

/* ------------------------------------------------------------------ */
/* XP and unlocks                                                      */
/* ------------------------------------------------------------------ */

export interface XpResult {
  level: number;
  xp: number;
  levelsGained: number;
  stardustGained: number;
  dewGained: number;
}

export function applyXp(save: SaveState, amount: number): XpResult {
  let level = save.level;
  let xp = save.xp + Math.max(0, Math.round(amount * (1 + bonusesFor(save).xp)));
  let levelsGained = 0;
  let stardustGained = 0;
  let dewGained = 0;
  while (xp >= levelXpNeeded(level) && level < MAX_LEVEL) {
    xp -= levelXpNeeded(level);
    level += 1;
    levelsGained += 1;
    stardustGained += level % 2 === 0 ? 1 : 0;
    dewGained += 20 * level;
  }
  return { level, xp, levelsGained, stardustGained, dewGained };
}

export function unlockedPlantsAt(level: number): PlantId[] {
  return PLANT_ORDER.filter((id) => PLANTS[id].unlockLevel <= level);
}

export function spiritsUnlockedAt(level: number): SpiritId[] {
  return SPIRIT_ORDER.filter((id) => SPIRITS[id].unlockLevel <= level);
}

/** Applies level-gated unlocks to the save. Returns human-readable unlock keys. */
export function syncLevelUnlocks(save: SaveState): string[] {
  const newly: string[] = [];
  for (const id of PLANT_ORDER) {
    if (PLANTS[id].unlockLevel <= save.level && !save.unlockedPlants.includes(id)) {
      save.unlockedPlants.push(id);
      newly.push(`plant.${id}`);
    }
  }
  for (const id of SPIRIT_ORDER) {
    const spirit = save.spirits[id];
    if (SPIRITS[id].unlockLevel <= save.level && spirit && !spirit.unlocked) {
      spirit.unlocked = true;
      newly.push(`spirit.${id}`);
    }
  }
  return newly;
}

/* ------------------------------------------------------------------ */
/* Harvest, inventory and selling                                      */
/* ------------------------------------------------------------------ */

export function rollYield(def: PlantDef, watered: number, bonuses: Bonuses, rng: () => number): number {
  const span = def.yieldMax - def.yieldMin + 1;
  const base = def.yieldMin + Math.floor(rng() * span);
  const vitality = def.waterNeed === 0 ? 1 : clamp(watered / def.waterNeed, 0, 1);
  const multiplier = (0.6 + 0.4 * vitality) * (1 + bonuses.yield);
  return Math.max(1, Math.round(base * multiplier));
}

export function harvestPlant(
  save: SaveState,
  plotIndex: number,
  now: number,
  rng: () => number,
): HarvestResult | null {
  const plot = save.plots[plotIndex];
  if (!plot?.plant) return null;
  const def = PLANTS[plot.plant.species];
  const bonuses = bonusesFor(save);
  const appliedWater = plot.plant.watered;
  const progress = growthOf(def, plot.plant.plantedAt, appliedWater, now, bonuses);
  if (!progress.ripe) return null;

  const crops = rollYield(def, appliedWater, bonuses, rng);
  const stardustChance = 0.03 + bonuses.stardust + def.tier * 0.012;
  const bonusStardust = rng() < stardustChance;
  const stardust = bonusStardust ? (def.tier >= 4 ? 2 : 1) : 0;

  delete plot.plant;
  save.inventory[def.id] = (save.inventory[def.id] ?? 0) + crops;
  save.stats.harvests += crops;
  save.stats.harvestsByPlant[def.id] = (save.stats.harvestsByPlant[def.id] ?? 0) + crops;
  if (def.tier >= RARE_TIER) save.stats.rareHarvests += crops;
  save.flags.harvestedFirst = true;
  save.stardust += stardust;

  const xpResult = applyXp(save, def.xp);
  applyXpResult(save, xpResult);

  return { crops, xp: def.xp, stardust, bonusStardust };
}

export function applyXpResult(
  save: SaveState,
  result: XpResult,
): void {
  save.level = result.level;
  save.xp = result.xp;
  save.stardust += result.stardustGained;
  save.dew += result.dewGained;
  save.stats.dewEarned += result.dewGained;
}

export function sellCrops(save: SaveState, plantId: PlantId, count: number): number {
  const have = save.inventory[plantId] ?? 0;
  const sold = Math.max(0, Math.min(have, Math.floor(count)));
  if (sold === 0) return 0;
  const def = PLANTS[plantId];
  const earned = Math.round(def.sellPrice * sold * dewMultiplier(save));
  save.inventory[plantId] = have - sold;
  if (save.inventory[plantId] === 0) delete save.inventory[plantId];
  save.dew += earned;
  save.stats.cropsSold += sold;
  save.stats.dewEarned += earned;
  return earned;
}

export function inventoryTotal(save: SaveState): number {
  return Object.values(save.inventory).reduce((sum, n) => sum + (n ?? 0), 0);
}

export function inventoryValue(save: SaveState): number {
  return Math.round(
    Object.entries(save.inventory).reduce((sum, [id, n]) => {
      const def = PLANTS[id as PlantId];
      return sum + (def ? def.sellPrice * (n ?? 0) : 0);
    }, 0) * dewMultiplier(save),
  );
}

/* ------------------------------------------------------------------ */
/* Plots                                                               */
/* ------------------------------------------------------------------ */

export function plotUnlockInfo(_save: SaveState, plotIndex: number): { level: number; cost: number } | null {
  const sealedIndex = plotIndex - STARTING_PLOTS;
  if (sealedIndex < 0 || sealedIndex >= PLOT_UNLOCKS.length) return null;
  return PLOT_UNLOCKS[sealedIndex] ?? null;
}

/* ------------------------------------------------------------------ */
/* Orders                                                              */
/* ------------------------------------------------------------------ */

function weightedSpirit(save: SaveState, rng: () => number): SpiritId {
  const unlocked = SPIRIT_ORDER.filter((id) => save.spirits[id]?.unlocked);
  const pool = unlocked.length > 0 ? unlocked : SPIRIT_ORDER;
  return pool[Math.floor(rng() * pool.length)] ?? 'mossling';
}

export function makeOrders(save: SaveState, now: number, rng: () => number): Order[] {
  const available = unlockedPlantsAt(Math.max(1, save.level));
  const count = 3;
  const orders: Order[] = [];
  for (let i = 0; i < count; i += 1) {
    const spirit = weightedSpirit(save, rng);
    const itemCount = 1 + (rng() < 0.45 ? 1 : 0) + (save.level >= 8 && rng() < 0.35 ? 1 : 0);
    const picked: PlantId[] = [];
    const pool = [...available];
    while (picked.length < itemCount && pool.length > 0) {
      const idx = Math.floor(rng() * pool.length);
      const id = pool.splice(idx, 1)[0];
      if (id) picked.push(id);
    }
    const items = picked.map((plant) => ({
      plant,
      count: 1 + Math.floor(rng() * (save.level >= 6 ? 3 : 2)),
    }));
    const baseValue = items.reduce((sum, item) => sum + PLANTS[item.plant].sellPrice * item.count, 0);
    const rewardDew = Math.round(baseValue * 1.35 + 25 * items.length + save.level * 4);
    const maxTier = Math.max(...items.map((item) => PLANTS[item.plant].tier));
    const rewardXp = Math.round(items.reduce((sum, item) => sum + PLANTS[item.plant].xp * item.count, 0) * 0.9);
    orders.push({
      id: `wish-${now.toString(36)}-${i}-${Math.floor(rng() * 1e6).toString(36)}`,
      spirit,
      items,
      rewardDew,
      rewardStardust: maxTier >= 3 ? 2 : 1,
      rewardXp,
      createdAt: now,
    });
  }
  return orders;
}

export function canFulfillOrder(save: SaveState, order: Order): boolean {
  return order.items.every((item) => (save.inventory[item.plant] ?? 0) >= item.count);
}

/* ------------------------------------------------------------------ */
/* Spirits                                                             */
/* ------------------------------------------------------------------ */

export function essencePerCrop(plantId: PlantId): number {
  return Math.max(4, Math.round(PLANTS[plantId].sellPrice * 0.5));
}

export function bondRequirement(bond: number): number {
  return bond >= MAX_BOND ? 0 : bondCost(bond);
}

export function offerToSpirit(save: SaveState, spiritId: SpiritId, plantId: PlantId, count: number): number {
  const spirit = save.spirits[spiritId];
  if (!spirit?.unlocked || spirit.bond >= MAX_BOND) return 0;
  const have = save.inventory[plantId] ?? 0;
  const need = Math.ceil((bondRequirement(spirit.bond) - spirit.essence) / essencePerCrop(plantId));
  const used = Math.max(0, Math.min(have, Math.floor(count), Math.max(0, need)));
  if (used === 0) return 0;
  const gained = used * essencePerCrop(plantId);
  save.inventory[plantId] = have - used;
  if (save.inventory[plantId] === 0) delete save.inventory[plantId];
  spirit.essence += gained;
  spirit.offerings += used;
  while (spirit.bond < MAX_BOND && spirit.essence >= bondRequirement(spirit.bond)) {
    spirit.essence -= bondRequirement(spirit.bond);
    spirit.bond += 1;
    save.stats.spiritsBonded += 1;
  }
  if (spirit.bond >= MAX_BOND) spirit.essence = 0;
  save.flags.metSpirit = spiritId;
  return used;
}

/* ------------------------------------------------------------------ */
/* Achievements and chapters                                           */
/* ------------------------------------------------------------------ */

export function metricValue(save: SaveState, metric: AchievementDef['metric']): number {
  switch (metric) {
    case 'harvests':
      return save.stats.harvests;
    case 'orders':
      return save.stats.ordersDone;
    case 'level':
      return save.level;
    case 'spirits':
      return SPIRIT_ORDER.filter((id) => save.spirits[id]?.unlocked).length;
    case 'bonds':
      return SPIRIT_ORDER.filter((id) => (save.spirits[id]?.bond ?? 0) >= 3).length;
    case 'decorations':
      return save.placedDecorations.length;
    case 'chapters':
      return save.chaptersRead.length;
    case 'dailyStreak':
      return save.stats.dailyMaxStreak;
    case 'dewEarned':
      return Math.round(save.stats.dewEarned);
    case 'rareHarvests':
      return save.stats.rareHarvests;
    default:
      return 0;
  }
}

export function achievementProgress(save: SaveState, def: AchievementDef): { value: number; done: boolean } {
  const value = clamp(metricValue(save, def.metric), 0, def.target);
  return { value, done: value >= def.target };
}

export function availableChapter(save: SaveState): ChapterDef | null {
  return CHAPTERS.find((c) => c.unlockLevel <= save.level && !save.chaptersRead.includes(c.index)) ?? null;
}

export function unlockedChapters(save: SaveState): ChapterDef[] {
  return CHAPTERS.filter((c) => c.unlockLevel <= save.level);
}

export function achievementById(id: string): AchievementDef | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}

/* ------------------------------------------------------------------ */
/* Daily, moonwell and guidance                                        */
/* ------------------------------------------------------------------ */

export const DAILY_COOLDOWN_MS = 20 * 60 * 60 * 1000;

export function dailyAvailableAt(save: SaveState): number {
  return save.daily.lastClaim === 0 ? 0 : save.daily.lastClaim + DAILY_COOLDOWN_MS;
}

export function dailyStreakOnClaim(save: SaveState, now: number): number {
  if (save.daily.lastClaim === 0) return 1;
  const gap = now - save.daily.lastClaim;
  return gap <= 2 * DAY_MS ? save.daily.streak + 1 : 1;
}

export function dailyReward(streak: number): { dew: number; stardust: number } {
  return { dew: 40 + 25 * Math.min(streak, 7), stardust: 1 + (streak % 3 === 0 ? 1 : 0) };
}

export function moonwellCharges(save: SaveState, now: number): number {
  return save.moonwell.date === localDateKey(now) ? save.moonwell.charges : 3;
}

export function boostCost(save: SaveState, now: number): number {
  return moonwellCharges(save, now) > 0 ? 0 : 2;
}

export function nextGoalKey(save: SaveState, now: number): string {
  if (save.plots.some((p) => p.plant)) {
    const bonuses = bonusesFor(save);
    const ripe = save.plots.some((p) => {
      if (!p.plant) return false;
      const def = PLANTS[p.plant.species];
      return growthOf(def, p.plant.plantedAt, p.plant.watered, now, bonuses).ripe;
    });
    if (ripe) return 'goal.harvest';
  }
  if (inventoryTotal(save) > 0 && save.orders.some((o) => canFulfillOrder(save, o))) return 'goal.deliver';
  if (inventoryTotal(save) > 0) return 'goal.sell';
  if (availableChapter(save)) return 'goal.story';
  if (save.plots.some((p) => p.unlocked && !p.plant)) return 'goal.plant';
  return 'goal.explore';
}

export function levelUnlockKeys(level: number): string[] {
  return LEVEL_UNLOCKS.filter((u) => u.level === level).map((u) => u.key);
}

export const TOTAL_PLOTS_COUNT = TOTAL_PLOTS;

/** Exposed for tests and the journal. */
export const content = {
  PLANTS,
  SPIRITS,
  DECORATIONS,
  CHAPTERS,
  ACHIEVEMENTS,
};
