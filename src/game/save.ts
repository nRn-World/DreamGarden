import type { DecoId, NightTaskId, Order, PlantId, Plot, SaveState, SpiritId } from './types';
import { DECO_ORDER, SPIRIT_ORDER } from './content/spirits';
import { PLANT_ORDER } from './content/plants';
import { ACHIEVEMENTS, TOTAL_PLOTS } from './content/progression';
import { SAVE_VERSION, createNewSave, emptySpiritState, makeOrders, syncLevelUnlocks } from './engine';

export const SAVE_KEY = 'dreamgarden.save.v1';
export const BACKUP_KEY = 'dreamgarden.save.backup.v1';
export const SETTINGS_KEY = 'dreamgarden.settings.v1';
export const APP_MARKER = 'dream-garden-by-nrnworld';

type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

function memoryStorage(): StorageLike {
  const map = new Map<string, string>();
  return {
    getItem: (k) => map.get(k) ?? null,
    setItem: (k, v) => {
      map.set(k, v);
    },
    removeItem: (k) => {
      map.delete(k);
    },
  };
}

const fallbackStorage = memoryStorage();

export function getStorage(): StorageLike {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.getItem(SAVE_KEY);
      return localStorage;
    }
  } catch {
    /* Private mode or a locked-down webview: keep playing in memory. */
  }
  return fallbackStorage;
}

function number(value: unknown, fallback: number, min = -Infinity, max = Infinity): number {
  return typeof value === 'number' && Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;
}

function bool(value: unknown, fallback = false): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function validOrder(raw: unknown): raw is Order {
  if (!isObject(raw)) return false;
  if (typeof raw.id !== 'string' || typeof raw.spirit !== 'string') return false;
  if (!SPIRIT_ORDER.includes(raw.spirit as SpiritId)) return false;
  if (!Array.isArray(raw.items) || raw.items.length === 0) return false;
  return raw.items.every(
    (item) =>
      isObject(item) &&
      typeof item.plant === 'string' &&
      PLANT_ORDER.includes(item.plant as PlantId) &&
      typeof item.count === 'number' &&
      item.count > 0 &&
      item.count <= 20,
  );
}

/**
 * Rebuilds a safe, complete save from arbitrary stored data.
 * Unknown fields are dropped and every value is bounded, so a damaged or
 * hand-edited save can never crash the game or grant impossible currency.
 */
export function repairSave(raw: unknown, now: number): SaveState {
  if (!isObject(raw)) return createNewSave(now);
  const base = createNewSave(now, typeof raw.locale === 'string' ? raw.locale : null);

  base.createdAt = number(raw.createdAt, now, 0, now);
  base.lastSeen = number(raw.lastSeen, now, 0, now);
  base.onboarded = bool(raw.onboarded);
  base.tutorial = number(raw.tutorial, 0, 0, 20);
  base.level = Math.round(number(raw.level, 1, 1, 60));
  base.xp = number(raw.xp, 0, 0, 1e9);
  base.dew = Math.round(number(raw.dew, 90, 0, 1e12));
  base.stardust = Math.round(number(raw.stardust, 2, 0, 1e9));
  base.lastChapterSeen = number(raw.lastChapterSeen, 0, 0, 17);
  base.ordersRefreshedAt = number(raw.ordersRefreshedAt, now, 0, now);

  const plantsFound = Array.isArray(raw.unlockedPlants)
    ? raw.unlockedPlants.filter((id): id is PlantId => typeof id === 'string' && PLANT_ORDER.includes(id as PlantId))
    : [];
  base.unlockedPlants = Array.from(new Set([...base.unlockedPlants, ...plantsFound]));

  if (Array.isArray(raw.plots)) {
    const plots: Plot[] = [];
    for (let i = 0; i < TOTAL_PLOTS; i += 1) {
      const p = raw.plots[i];
      const unlocked = isObject(p) ? bool(p.unlocked, i < 6) : i < 6;
      const plot: Plot = { id: i, unlocked };
      if (isObject(p) && isObject(p.plant) && typeof p.plant.species === 'string') {
        const species = p.plant.species as PlantId;
        if (PLANT_ORDER.includes(species)) {
          plot.plant = {
            species,
            plantedAt: number(p.plant.plantedAt, now, 0, now + 60_000),
            watered: Math.round(number(p.plant.watered, 0, 0, 10)),
            totalWatered: Math.round(number(p.plant.totalWatered, 0, 0, 999)),
          };
        }
      }
      plots.push(plot);
    }
    base.plots = plots;
  }

  if (isObject(raw.inventory)) {
    base.inventory = {};
    for (const id of PLANT_ORDER) {
      const n = raw.inventory[id];
      if (typeof n === 'number' && Number.isFinite(n) && n > 0) {
        base.inventory[id] = Math.min(1e9, Math.floor(n));
      }
    }
  }

  if (isObject(raw.spirits)) {
    for (const id of SPIRIT_ORDER) {
      const s = raw.spirits[id];
      if (isObject(s)) {
        base.spirits[id] = {
          ...emptySpiritState(),
          unlocked: bool(s.unlocked),
          bond: Math.round(number(s.bond, 1, 1, 5)),
          essence: number(s.essence, 0, 0, 1e9),
          offerings: Math.round(number(s.offerings, 0, 0, 1e9)),
        };
      }
    }
  }

  if (Array.isArray(raw.equipped)) {
    base.equipped = Array.from(
      new Set(raw.equipped.filter((id): id is SpiritId => typeof id === 'string' && SPIRIT_ORDER.includes(id as SpiritId))),
    ).slice(0, 3);
  }

  if (isObject(raw.decorations)) {
    for (const id of DECO_ORDER) {
      base.decorations[id] = bool(raw.decorations[id]);
    }
  }
  if (Array.isArray(raw.placedDecorations)) {
    base.placedDecorations = Array.from(
      new Set(raw.placedDecorations.filter((id): id is DecoId => typeof id === 'string' && DECO_ORDER.includes(id as DecoId))),
    ).filter((id) => base.decorations[id]);
  }

  if (Array.isArray(raw.orders) && raw.orders.length > 0 && raw.orders.every(validOrder)) {
    base.orders = raw.orders as Order[];
  } else {
    base.orders = makeOrders(base, now, Math.random);
  }
  base.ordersCompleted = Math.round(number(raw.ordersCompleted, 0, 0, 1e9));
  base.achievementsClaimed = Array.isArray(raw.achievementsClaimed)
    ? raw.achievementsClaimed.filter(
        (id): id is string => typeof id === 'string' && ACHIEVEMENTS.some((a) => a.id === id),
      )
    : [];
  base.chaptersRead = Array.isArray(raw.chaptersRead)
    ? Array.from(new Set(raw.chaptersRead.filter((n): n is number => typeof n === 'number' && n >= 1 && n <= 17)))
    : [];

  if (isObject(raw.daily)) {
    base.daily = {
      lastClaim: number(raw.daily.lastClaim, 0, 0, now),
      streak: Math.round(number(raw.daily.streak, 0, 0, 1e6)),
      totalClaims: Math.round(number(raw.daily.totalClaims, 0, 0, 1e6)),
    };
  }

  base.nightsCleared = Math.round(number(raw.nightsCleared, 0, 0, 1e6));
  if (isObject(raw.night) && typeof raw.night.date === 'string' && Array.isArray(raw.night.tasks)) {
    const ids: NightTaskId[] = ['plant', 'water', 'harvest', 'feed', 'order', 'tale'];
    base.night = {
      date: raw.night.date,
      slept: bool(raw.night.slept),
      tasks: raw.night.tasks
        .filter((t): t is Record<string, unknown> => isObject(t) && ids.includes(t.id as NightTaskId))
        .slice(0, 3)
        .map((t) => ({
          id: t.id as NightTaskId,
          target: Math.round(number(t.target, 1, 1, 20)),
          base: Math.round(number(t.base, 0, 0, 1e9)),
        })),
    };
  }

  if (isObject(raw.moonwell)) {
    base.moonwell = {
      date: typeof raw.moonwell.date === 'string' ? raw.moonwell.date : base.moonwell.date,
      charges: Math.round(number(raw.moonwell.charges, 3, 0, 3)),
    };
  }

  if (isObject(raw.stats)) {
    const s = raw.stats;
    base.stats = {
      harvests: Math.round(number(s.harvests, 0, 0, 1e9)),
      harvestsByPlant: {},
      ordersDone: Math.round(number(s.ordersDone, 0, 0, 1e9)),
      spiritsBonded: Math.round(number(s.spiritsBonded, 0, 0, 1e9)),
      cropsSold: Math.round(number(s.cropsSold, 0, 0, 1e9)),
      dewEarned: number(s.dewEarned, 0, 0, 1e12),
      planted: Math.round(number(s.planted, 0, 0, 1e9)),
      chaptersRead: Math.round(number(s.chaptersRead, 0, 0, 17)),
      dailyMaxStreak: Math.round(number(s.dailyMaxStreak, 0, 0, 1e6)),
      boostsUsed: Math.round(number(s.boostsUsed, 0, 0, 1e9)),
      rareHarvests: Math.round(number(s.rareHarvests, 0, 0, 1e9)),
      watered: Math.round(number(s.watered, 0, 0, 1e9)),
      tales: Math.round(number(s.tales, 0, 0, 1e9)),
    };
    if (isObject(s.harvestsByPlant)) {
      for (const id of PLANT_ORDER) {
        const n = s.harvestsByPlant[id];
        if (typeof n === 'number' && Number.isFinite(n) && n > 0) {
          base.stats.harvestsByPlant[id] = Math.floor(n);
        }
      }
    }
  }

  if (isObject(raw.settings)) {
    const s = raw.settings;
    base.settings = {
      sound: bool(s.sound, true),
      music: bool(s.music, true),
      haptics: bool(s.haptics, true),
      reducedMotion: bool(s.reducedMotion, false),
      largeText: bool(s.largeText, false),
    };
  }

  if (isObject(raw.flags)) {
    base.flags = {
      metSpirit:
        typeof raw.flags.metSpirit === 'string' && SPIRIT_ORDER.includes(raw.flags.metSpirit as SpiritId)
          ? (raw.flags.metSpirit as SpiritId)
          : null,
      sawHarmony: bool(raw.flags.sawHarmony),
      harvestedFirst: bool(raw.flags.harvestedFirst),
    };
  }

  base.version = SAVE_VERSION;
  syncLevelUnlocks(base);
  return base;
}

export interface LoadResult {
  save: SaveState;
  recovered: boolean;
  fresh: boolean;
}

export function loadSave(now = Date.now(), storage: StorageLike = getStorage()): LoadResult {
  const rawPrimary = storage.getItem(SAVE_KEY);
  if (rawPrimary) {
    try {
      const parsed: unknown = JSON.parse(rawPrimary);
      return { save: repairSave(parsed, now), recovered: false, fresh: false };
    } catch {
      /* fall through to backup */
    }
  }
  const rawBackup = storage.getItem(BACKUP_KEY);
  if (rawBackup) {
    try {
      const parsed: unknown = JSON.parse(rawBackup);
      return { save: repairSave(parsed, now), recovered: true, fresh: false };
    } catch {
      /* fall through to a new garden */
    }
  }
  if (rawPrimary) {
    storage.removeItem(SAVE_KEY);
    return { save: createNewSave(now), recovered: true, fresh: true };
  }
  return { save: createNewSave(now), recovered: false, fresh: true };
}

export function saveGame(save: SaveState, storage: StorageLike = getStorage()): boolean {
  try {
    const payload = JSON.stringify(save);
    const previous = storage.getItem(SAVE_KEY);
    if (previous) storage.setItem(BACKUP_KEY, previous);
    storage.setItem(SAVE_KEY, payload);
    return true;
  } catch {
    return false;
  }
}

export function clearSave(storage: StorageLike = getStorage()): void {
  storage.removeItem(SAVE_KEY);
  storage.removeItem(BACKUP_KEY);
}

export function exportSave(save: SaveState): string {
  return JSON.stringify({ app: APP_MARKER, version: SAVE_VERSION, savedAt: Date.now(), save }, null, 2);
}

export function importSave(text: string, now = Date.now()): SaveState | null {
  try {
    const parsed: unknown = JSON.parse(text);
    if (!isObject(parsed)) return null;
    if (parsed.app !== APP_MARKER) return null;
    if (!isObject(parsed.save)) return null;
    return repairSave(parsed.save, now);
  } catch {
    return null;
  }
}
