import { describe, expect, it } from 'vitest';
import {
  applyXp,
  bonusesFor,
  canFulfillOrder,
  createNewSave,
  dailyAvailableAt,
  dailyReward,
  dailyStreakOnClaim,
  dewMultiplier,
  emptyPlotCount,
  growthDuration,
  growthOf,
  harmonyOf,
  harvestPlant,
  inventoryTotal,
  inventoryValue,
  levelXpNeeded,
  makeOrders,
  moonPhaseOf,
  moonwellCharges,
  nextGoalKey,
  nightPlanDone,
  nightProgress,
  offerToSpirit,
  planNight,
  plotUnlockInfo,
  sellCrops,
  sleepNight,
  syncLevelUnlocks,
  weatherOf,
} from '../game/engine';
import { PLANTS } from '../game/content/plants';
import { DECORATIONS, SPIRITS } from '../game/content/spirits';
import { DAILY_COOLDOWN_MS } from '../game/engine';

const NOW = 1_760_000_000_000;

function fresh() {
  return createNewSave(NOW, 'en');
}

describe('new save', () => {
  it('starts with six open beds, dew and three wishes', () => {
    const save = fresh();
    expect(save.plots).toHaveLength(12);
    expect(save.plots.filter((p) => p.unlocked)).toHaveLength(6);
    expect(save.dew).toBe(90);
    expect(save.stardust).toBe(2);
    expect(save.orders).toHaveLength(3);
    expect(save.level).toBe(1);
    expect(save.unlockedPlants).toEqual(['dewbell', 'lumenlotus']);
    expect(emptyPlotCount(save)).toBe(6);
  });

  it('maps sealed beds to their level and cost', () => {
    expect(plotUnlockInfo(fresh(), 0)).toBeNull();
    expect(plotUnlockInfo(fresh(), 6)).toEqual({ level: 3, cost: 120 });
    expect(plotUnlockInfo(fresh(), 11)).toEqual({ level: 17, cost: 9000 });
  });
});

describe('growth', () => {
  it('reports stages and ripens exactly at the grow duration', () => {
    const save = fresh();
    const def = PLANTS.dewbell;
    save.plots[0].plant = { species: 'dewbell', plantedAt: NOW, watered: 0, totalWatered: 0 };
    expect(growthOf(def, NOW, 0, NOW, bonusesFor(save))).toMatchObject({ stage: 0, ripe: false, progress: 0 });
    expect(growthOf(def, NOW, 0, NOW + def.growMs / 2, bonusesFor(save)).stage).toBe(2);
    const done = growthOf(def, NOW, 0, NOW + def.growMs, bonusesFor(save));
    expect(done.ripe).toBe(true);
    expect(done.progress).toBe(1);
    expect(done.stage).toBe(3);
  });

  it('waters faster and never divides by zero', () => {
    const save = fresh();
    const dry = growthDuration(PLANTS.dewbell, 0, bonusesFor(save));
    const wet = growthDuration(PLANTS.dewbell, 2, bonusesFor(save));
    expect(wet).toBeLessThan(dry);
    save.equipped = ['emberling'];
    save.spirits.emberling = { unlocked: true, bond: 5, essence: 0, offerings: 0 };
    const boosted = growthDuration(PLANTS.dewbell, 2, bonusesFor(save));
    expect(boosted).toBeLessThan(wet);
  });
});

describe('harvest and economy', () => {
  it('does not harvest an unripe bloom', () => {
    const save = fresh();
    save.plots[0].plant = { species: 'dewbell', plantedAt: NOW, watered: 1, totalWatered: 1 };
    expect(harvestPlant(save, 0, NOW + 1000, () => 0.5)).toBeNull();
  });

  it('harvests into the basket, grants xp and can trigger stardust', () => {
    const save = fresh();
    save.plots[0].plant = { species: 'dewbell', plantedAt: NOW, watered: 1, totalWatered: 1 };
    const result = harvestPlant(save, 0, NOW + PLANTS.dewbell.growMs, () => 0.99);
    expect(result).not.toBeNull();
    expect(result!.crops).toBe(2);
    expect(result!.stardust).toBe(0);
    expect(save.inventory.dewbell).toBe(2);
    expect(save.stats.harvests).toBe(2);
    expect(save.xp).toBe(PLANTS.dewbell.xp);
    expect(save.plots[0].plant).toBeUndefined();

    const lucky = fresh();
    lucky.plots[0].plant = { species: 'dewbell', plantedAt: NOW, watered: 1, totalWatered: 1 };
    const luckyResult = harvestPlant(lucky, 0, NOW + PLANTS.dewbell.growMs, () => 0.0001);
    expect(luckyResult!.stardust).toBe(1);
  });

  it('watered blooms yield more than dry blooms', () => {
    const dry = fresh();
    dry.plots[0].plant = { species: 'lumenlotus', plantedAt: NOW, watered: 0, totalWatered: 0 };
    const dryResult = harvestPlant(dry, 0, NOW + PLANTS.lumenlotus.growMs, () => 0.9);

    const wet = fresh();
    wet.plots[0].plant = { species: 'lumenlotus', plantedAt: NOW, watered: 1, totalWatered: 1 };
    const wetResult = harvestPlant(wet, 0, NOW + PLANTS.lumenlotus.growMs, () => 0.9);
    expect(wetResult!.crops).toBeGreaterThan(dryResult!.crops);
  });

  it('sells crops with a harmony multiplier', () => {
    const save = fresh();
    save.inventory.moonrose = 3;
    save.placedDecorations = ['lantern', 'pond'];
    const expected = Math.round(PLANTS.moonrose.sellPrice * 3 * dewMultiplier(save));
    expect(inventoryValue(save)).toBe(expected);
    expect(sellCrops(save, 'moonrose', 10)).toBe(expected);
    expect(save.inventory.moonrose).toBeUndefined();
    expect(save.stats.cropsSold).toBe(3);
    expect(save.dew).toBe(90 + expected);
    expect(inventoryTotal(save)).toBe(0);
  });
});

describe('progression', () => {
  it('levels up, grants even-level stardust and unlocks content', () => {
    const save = fresh();
    const result = applyXp(save, levelXpNeeded(1) + levelXpNeeded(2) + 10);
    expect(result.level).toBeGreaterThan(1);
    expect(result.stardustGained).toBeGreaterThanOrEqual(1);
    save.level = result.level;
    save.xp = result.xp;
    const unlocked = syncLevelUnlocks(save);
    expect(unlocked.length).toBeGreaterThan(0);
    expect(save.unlockedPlants).toContain('starfern');
    expect(save.spirits.mossling.unlocked).toBe(true);
  });

  it('adds spirit bonuses to dew and harmony', () => {
    const save = fresh();
    save.placedDecorations = ['pond'];
    save.spirits.tidewhisper = { unlocked: true, bond: 4, essence: 0, offerings: 0 };
    save.equipped = ['tidewhisper'];
    expect(harmonyOf(save)).toBe(DECORATIONS.pond.harmony);
    const bonuses = bonusesFor(save);
    expect(bonuses.dew).toBeCloseTo(0.05 * 4 + DECORATIONS.pond.harmony * 0.004, 5);
    expect(dewMultiplier(save)).toBeGreaterThan(1);
  });

  it('bonds spirits by offering crops', () => {
    const save = fresh();
    save.spirits.mossling = { unlocked: true, bond: 1, essence: 0, offerings: 0 };
    save.inventory.moonrose = 5;
    const used = offerToSpirit(save, 'mossling', 'moonrose', 5);
    expect(used).toBeGreaterThan(0);
    expect(save.spirits.mossling.bond).toBeGreaterThan(1);
    expect(save.spirits.mossling.offerings).toBe(used);
    expect(save.inventory.moonrose).toBe(5 - used);
  });

  it('never bonds beyond five', () => {
    const save = fresh();
    save.spirits.mossling = { unlocked: true, bond: 5, essence: 0, offerings: 0 };
    save.inventory.eternitybloom = 10;
    expect(offerToSpirit(save, 'mossling', 'eternitybloom', 10)).toBe(0);
    expect(save.inventory.eternitybloom).toBe(10);
  });

  it('generates fulfilable orders with positive rewards', () => {
    const save = fresh();
    save.level = 9;
    const orders = makeOrders(save, NOW, () => 0.4);
    expect(orders).toHaveLength(3);
    for (const order of orders) {
      expect(order.items.length).toBeGreaterThan(0);
      expect(order.rewardDew).toBeGreaterThan(0);
      expect(order.rewardXp).toBeGreaterThan(0);
      expect(SPIRITS[order.spirit]).toBeDefined();
    }
    const order = orders[0];
    for (const item of order.items) save.inventory[item.plant] = item.count;
    expect(canFulfillOrder(save, order)).toBe(true);
    save.inventory[order.items[0].plant] = 0;
    expect(canFulfillOrder(save, order)).toBe(false);
  });

  it('suggests the next useful goal', () => {
    const save = fresh();
    expect(nextGoalKey(save, NOW)).toBe('goal.story');
    save.plots[0].plant = { species: 'dewbell', plantedAt: NOW, watered: 1, totalWatered: 1 };
    expect(nextGoalKey(save, NOW + PLANTS.dewbell.growMs + 1)).toBe('goal.harvest');
    save.inventory.dewbell = 2;
    delete save.plots[0].plant;
    save.orders = [];
    expect(nextGoalKey(save, NOW + PLANTS.dewbell.growMs + 1)).toBe('goal.sell');
  });
});

describe('daily gifts and the moonwell', () => {
  it('uses a twenty-hour cooldown and grows a streak', () => {
    const save = fresh();
    expect(dailyAvailableAt(save)).toBe(0);
    expect(dailyStreakOnClaim(save, NOW)).toBe(1);
    save.daily = { lastClaim: NOW, streak: 3, totalClaims: 3 };
    expect(dailyAvailableAt(save)).toBe(NOW + DAILY_COOLDOWN_MS);
    expect(dailyStreakOnClaim(save, NOW + 4 * 60 * 60 * 1000)).toBe(4);
    expect(dailyStreakOnClaim(save, NOW + 3 * 24 * 60 * 60 * 1000)).toBe(1);
    expect(dailyReward(1).dew).toBe(65);
    expect(dailyReward(3).stardust).toBe(2);
  });

  it('gives three free boosts per local day', () => {
    const save = fresh();
    expect(moonwellCharges(save, NOW)).toBe(3);
    save.moonwell = { date: 'yesterday', charges: 0 };
    expect(moonwellCharges(save, NOW)).toBe(3);
  });
});

describe('the nightly plan', () => {
  const DAY = 24 * 60 * 60 * 1000;

  it('plans three tasks once per local day, always ending with a tale', () => {
    const save = fresh();
    expect(planNight(save, NOW)).toBe(true);
    expect(save.night.tasks).toHaveLength(3);
    expect(save.night.tasks[2].id).toBe('tale');
    expect(new Set(save.night.tasks.map((t) => t.id)).size).toBe(3);
    const first = JSON.stringify(save.night);
    expect(planNight(save, NOW + 1000)).toBe(false);
    expect(JSON.stringify(save.night)).toBe(first);
    expect(planNight(save, NOW + 2 * DAY)).toBe(true);
    expect(save.night.slept).toBe(false);
  });

  it('only counts what the player does after the plan was made', () => {
    const save = fresh();
    save.stats.planted = 5;
    save.stats.watered = 5;
    save.stats.tales = 5;
    planNight(save, NOW);
    expect(nightProgress(save).every((t) => t.value === 0)).toBe(true);
    for (const task of save.night.tasks) {
      if (task.id === 'plant') save.stats.planted += task.target;
      if (task.id === 'water') save.stats.watered += task.target;
      if (task.id === 'harvest') save.stats.harvests += task.target;
      if (task.id === 'feed') save.spirits.mossling.offerings += task.target;
      if (task.id === 'order') save.stats.ordersDone += task.target;
      if (task.id === 'tale') save.stats.tales += task.target;
      if (task.id === 'breathe') save.stats.breaths += task.target;
      if (task.id === 'reflect') save.stats.reflections += task.target;
    }
    expect(nightPlanDone(save)).toBe(true);
  });

  it('refuses to sleep early and pays out exactly once', () => {
    const save = fresh();
    planNight(save, NOW);
    expect(sleepNight(save)).toBeNull();
    save.night.tasks = save.night.tasks.map((t) => ({ ...t, base: t.base - t.target }));
    const dew = save.dew;
    const reward = sleepNight(save);
    expect(reward).not.toBeNull();
    expect(save.dew).toBe(dew + reward!.dew);
    expect(save.nightsCleared).toBe(1);
    expect(sleepNight(save)).toBeNull();
    expect(save.nightsCleared).toBe(1);
  });
});

describe('streaks, moon and sky', () => {
  function finishedNight(save: ReturnType<typeof fresh>, now: number) {
    planNight(save, now);
    save.night.tasks = save.night.tasks.map((t) => ({ ...t, base: t.base - t.target }));
    return sleepNight(save);
  }
  const DAY = 24 * 60 * 60 * 1000;

  it('grows the streak on consecutive nights and resets after a gap', () => {
    const save = fresh();
    expect(finishedNight(save, NOW)?.streak).toBe(1);
    expect(finishedNight(save, NOW + DAY)?.streak).toBe(2);
    expect(finishedNight(save, NOW + 5 * DAY)?.streak).toBe(1);
    expect(save.stats.bestNightStreak).toBe(2);
  });

  it('spends a moon freeze to forgive exactly one missed night and earns one per week', () => {
    const save = fresh();
    for (let i = 0; i < 7; i += 1) finishedNight(save, NOW + i * DAY);
    expect(save.nightStreak).toBe(7);
    expect(save.nightFreezes).toBe(1);
    const result = finishedNight(save, NOW + 8 * DAY);
    expect(result?.usedFreeze).toBe(true);
    expect(result?.streak).toBe(8);
    expect(save.nightFreezes).toBe(0);
  });

  it('knows the real moon and gives the same sky to everyone on a date', () => {
    expect(moonPhaseOf('2000-01-06')).toBe('new');
    expect(moonPhaseOf('2024-06-22')).toBe('full');
    expect(weatherOf('2026-10-24')).toBe(weatherOf('2026-10-24'));
    const skies = new Set(Array.from({ length: 60 }, (_, i) => weatherOf(`2026-11-${(i % 28) + 1}`)));
    expect(skies.size).toBeGreaterThan(1);
  });
});
