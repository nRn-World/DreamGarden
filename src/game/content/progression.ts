import type { AchievementDef, ChapterDef, Plot } from '../types';

export const CHAPTERS: ChapterDef[] = [
  { index: 1, unlockLevel: 1, rewardDew: 60, rewardStardust: 1 },
  { index: 2, unlockLevel: 3, rewardDew: 140, rewardStardust: 2 },
  { index: 3, unlockLevel: 6, rewardDew: 320, rewardStardust: 2 },
  { index: 4, unlockLevel: 9, rewardDew: 700, rewardStardust: 3 },
  { index: 5, unlockLevel: 13, rewardDew: 1500, rewardStardust: 4 },
  { index: 6, unlockLevel: 17, rewardDew: 4000, rewardStardust: 8 },
];

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: 'firstBloom', metric: 'harvests', target: 1, rewardDew: 30, rewardStardust: 0 },
  { id: 'greenThumb', metric: 'harvests', target: 25, rewardDew: 150, rewardStardust: 1 },
  { id: 'dreamWeaver', metric: 'harvests', target: 100, rewardDew: 600, rewardStardust: 2 },
  { id: 'wishGranter', metric: 'orders', target: 10, rewardDew: 400, rewardStardust: 1 },
  { id: 'spiritFriend', metric: 'bonds', target: 3, rewardDew: 500, rewardStardust: 2 },
  { id: 'constellation', metric: 'spirits', target: 4, rewardDew: 900, rewardStardust: 3 },
  { id: 'decorator', metric: 'decorations', target: 4, rewardDew: 700, rewardStardust: 1 },
  { id: 'patientGardener', metric: 'level', target: 10, rewardDew: 500, rewardStardust: 2 },
  { id: 'nightGardener', metric: 'dailyStreak', target: 5, rewardDew: 400, rewardStardust: 3 },
  { id: 'keeperOfDreams', metric: 'chapters', target: 6, rewardDew: 2000, rewardStardust: 5 },
  { id: 'rareBloom', metric: 'rareHarvests', target: 10, rewardDew: 1200, rewardStardust: 3 },
  { id: 'abundance', metric: 'dewEarned', target: 10000, rewardDew: 1500, rewardStardust: 4 },
];

/** Plot costs for the six plots that start sealed (ids 6-11). */
export const PLOT_UNLOCKS: { level: number; cost: number }[] = [
  { level: 3, cost: 120 },
  { level: 5, cost: 300 },
  { level: 8, cost: 750 },
  { level: 11, cost: 1800 },
  { level: 14, cost: 4000 },
  { level: 17, cost: 9000 },
];

export const STARTING_PLOTS = 6;
export const TOTAL_PLOTS = 12;

export function makePlots(): Plot[] {
  return Array.from({ length: TOTAL_PLOTS }, (_, id) => ({ id, unlocked: id < STARTING_PLOTS }));
}

export const LEVEL_UNLOCKS: { level: number; key: string }[] = [
  { level: 2, key: 'spirit.mossling' },
  { level: 3, key: 'plant.starfern' },
  { level: 4, key: 'spirit.tidewhisper' },
  { level: 5, key: 'plant.moonrose' },
  { level: 6, key: 'deco.arch' },
  { level: 7, key: 'spirit.emberling' },
  { level: 8, key: 'plant.sunspire' },
  { level: 9, key: 'deco.bench' },
  { level: 10, key: 'spirit.starling' },
  { level: 11, key: 'plant.crystalbloom' },
  { level: 12, key: 'deco.mushrooms' },
  { level: 13, key: 'spirit.petalwisp' },
  { level: 14, key: 'plant.whisperorchid' },
  { level: 15, key: 'deco.chimes' },
  { level: 16, key: 'spirit.nocturne' },
  { level: 17, key: 'plant.eternitybloom' },
];
