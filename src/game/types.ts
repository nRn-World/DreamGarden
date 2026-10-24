/* Domain types for Dream Garden. Pure data — no rendering, storage or platform code. */

export type PlantId =
  | 'dewbell'
  | 'lumenlotus'
  | 'starfern'
  | 'moonrose'
  | 'sunspire'
  | 'crystalbloom'
  | 'whisperorchid'
  | 'eternitybloom';

export type SpiritId = 'mossling' | 'tidewhisper' | 'emberling' | 'starling' | 'petalwisp' | 'nocturne';

export type DecoId = 'lantern' | 'pond' | 'arch' | 'bench' | 'mushrooms' | 'chimes';

export type PlantShape = 'bell' | 'lotus' | 'fern' | 'rose' | 'spire' | 'crystal' | 'orchid' | 'eternal';

export type SpiritPassive = 'yield' | 'dew' | 'growth' | 'stardust' | 'orders' | 'xp';

export type SpiritElement = 'moss' | 'tide' | 'ember' | 'star' | 'petal' | 'moon';

export interface Palette {
  petal: string;
  petalDeep: string;
  core: string;
  stem: string;
  leaf: string;
  glow: string;
}

export interface PlantDef {
  id: PlantId;
  shape: PlantShape;
  tier: 1 | 2 | 3 | 4 | 5;
  unlockLevel: number;
  seedCost: number;
  sellPrice: number;
  growMs: number;
  yieldMin: number;
  yieldMax: number;
  xp: number;
  waterNeed: number;
  palette: Palette;
}

export interface SpiritDef {
  id: SpiritId;
  element: SpiritElement;
  unlockLevel: number;
  passive: SpiritPassive;
  /** Passive strength per bond level, e.g. 0.05 = +5% at bond 1. */
  power: number;
  palette: Palette;
}

export interface DecoDef {
  id: DecoId;
  cost: number;
  harmony: number;
  unlockLevel: number;
  /** Position preset in the garden scene. */
  slot: 'left-back' | 'right-back' | 'left-mid' | 'right-mid' | 'left-front' | 'right-front';
}

export interface ChapterDef {
  index: number;
  unlockLevel: number;
  rewardDew: number;
  rewardStardust: number;
}

export interface Planted {
  species: PlantId;
  plantedAt: number;
  watered: number;
  totalWatered: number;
}

export interface Plot {
  id: number;
  unlocked: boolean;
  plant?: Planted;
}

export interface SpiritState {
  unlocked: boolean;
  bond: number;
  essence: number;
  /** Total crops offered to this spirit, for flavour and achievements. */
  offerings: number;
}

export interface Order {
  id: string;
  spirit: SpiritId;
  items: { plant: PlantId; count: number }[];
  rewardDew: number;
  rewardStardust: number;
  rewardXp: number;
  createdAt: number;
}

export interface AchievementDef {
  id: string;
  metric: 'harvests' | 'orders' | 'level' | 'spirits' | 'bonds' | 'decorations' | 'chapters' | 'dailyStreak' | 'dewEarned' | 'rareHarvests';
  target: number;
  rewardDew: number;
  rewardStardust: number;
}

export interface Settings {
  sound: boolean;
  music: boolean;
  haptics: boolean;
  reducedMotion: boolean;
  largeText: boolean;
}

export interface Stats {
  harvests: number;
  harvestsByPlant: Partial<Record<PlantId, number>>;
  ordersDone: number;
  spiritsBonded: number;
  cropsSold: number;
  dewEarned: number;
  planted: number;
  chaptersRead: number;
  dailyMaxStreak: number;
  boostsUsed: number;
  rareHarvests: number;
  watered: number;
  /** Times a tale was opened, new or re-read; feeds the nightly "read a tale" task. */
  tales: number;
}

export type NightTaskId = 'plant' | 'water' | 'harvest' | 'feed' | 'order' | 'tale';

export interface NightTask {
  id: NightTaskId;
  target: number;
  /** Value of the matching counter when the night's plan was made. */
  base: number;
}

export interface NightState {
  /** Local date the plan belongs to; a new date means a new night and a new plan. */
  date: string;
  tasks: NightTask[];
  slept: boolean;
}

export interface DailyState {
  lastClaim: number;
  streak: number;
  totalClaims: number;
}

export interface SaveState {
  version: number;
  createdAt: number;
  lastSeen: number;
  locale: string | null;
  onboarded: boolean;
  tutorial: number;
  level: number;
  xp: number;
  dew: number;
  stardust: number;
  plots: Plot[];
  inventory: Partial<Record<PlantId, number>>;
  unlockedPlants: PlantId[];
  spirits: Record<SpiritId, SpiritState>;
  equipped: SpiritId[];
  decorations: Record<DecoId, boolean>;
  placedDecorations: DecoId[];
  orders: Order[];
  ordersRefreshedAt: number;
  ordersCompleted: number;
  achievementsClaimed: string[];
  chaptersRead: number[];
  lastChapterSeen: number;
  daily: DailyState;
  night: NightState;
  nightsCleared: number;
  moonwell: { date: string; charges: number };
  settings: Settings;
  stats: Stats;
  flags: {
    metSpirit: SpiritId | null;
    sawHarmony: boolean;
    harvestedFirst: boolean;
  };
}

export interface Progress {
  progress: number;
  ripe: boolean;
  remainingMs: number;
  stage: 0 | 1 | 2 | 3;
  durationMs: number;
}

export interface Bonuses {
  dew: number;
  growth: number;
  yield: number;
  stardust: number;
  orders: number;
  xp: number;
}

export interface HarvestResult {
  crops: number;
  xp: number;
  stardust: number;
  bonusStardust: boolean;
}
