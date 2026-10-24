import { describe, expect, it } from 'vitest';
import {
  BACKUP_KEY,
  SAVE_KEY,
  exportSave,
  importSave,
  loadSave,
  repairSave,
  saveGame,
} from '../game/save';
import { createNewSave } from '../game/engine';

const NOW = 1_760_000_000_000;

function memoryStorage() {
  const map = new Map<string, string>();
  return {
    map,
    getItem: (key: string) => map.get(key) ?? null,
    setItem: (key: string, value: string) => {
      map.set(key, value);
    },
    removeItem: (key: string) => {
      map.delete(key);
    },
  };
}

describe('save persistence', () => {
  it('round-trips a garden and keeps a backup of the previous save', () => {
    const storage = memoryStorage();
    const save = createNewSave(NOW, 'en');
    save.dew = 1234;
    save.plots[0].plant = { species: 'dewbell', plantedAt: NOW - 10_000, watered: 1, totalWatered: 1 };
    expect(saveGame(save, storage)).toBe(true);
    expect(storage.getItem(SAVE_KEY)).toBeTruthy();

    save.dew = 9999;
    saveGame(save, storage);
    expect(storage.getItem(BACKUP_KEY)).toContain('1234');

    const loaded = loadSave(NOW, storage);
    expect(loaded.recovered).toBe(false);
    expect(loaded.save.dew).toBe(9999);
    expect(loaded.save.plots[0].plant?.species).toBe('dewbell');
  });

  it('recovers from a corrupted primary save using the backup', () => {
    const storage = memoryStorage();
    const save = createNewSave(NOW, 'en');
    save.dew = 432;
    saveGame(save, storage);
    save.dew = 777;
    saveGame(save, storage);
    storage.setItem(SAVE_KEY, '{"broken":');

    const loaded = loadSave(NOW, storage);
    expect(loaded.recovered).toBe(true);
    expect(loaded.fresh).toBe(false);
    expect(loaded.save.dew).toBe(432);
  });

  it('creates a fresh garden when both copies are unreadable', () => {
    const storage = memoryStorage();
    storage.setItem(SAVE_KEY, 'not json');
    storage.setItem(BACKUP_KEY, 'also not json');
    const loaded = loadSave(NOW, storage);
    expect(loaded.recovered).toBe(true);
    expect(loaded.fresh).toBe(true);
    expect(loaded.save.level).toBe(1);
    expect(storage.getItem(SAVE_KEY)).toBeNull();
  });
});

describe('save repair', () => {
  it('clamps impossible currency, level and plot data', () => {
    const repaired = repairSave(
      {
        level: 999,
        dew: -50,
        stardust: Number.POSITIVE_INFINITY,
        xp: -12,
        plots: [{ unlocked: true, plant: { species: 'not-a-plant', plantedAt: 'soon' } }],
        inventory: { dewbell: 12.7, bogus: 4 },
        equipped: ['mossling', 'mossling', 'bogus'],
        orders: [],
      },
      NOW,
    );
    expect(repaired.level).toBe(60);
    expect(repaired.dew).toBe(0);
    expect(repaired.stardust).toBe(2);
    expect(repaired.xp).toBe(0);
    expect(repaired.plots).toHaveLength(12);
    expect(repaired.plots[0].plant).toBeUndefined();
    expect(repaired.inventory.dewbell).toBe(12);
    expect(repaired.inventory).not.toHaveProperty('bogus');
    expect(repaired.equipped).toEqual(['mossling']);
    expect(repaired.orders).toHaveLength(3);
  });

  it('keeps level-gated unlocks in sync', () => {
    const repaired = repairSave({ level: 17 }, NOW);
    expect(repaired.unlockedPlants).toContain('whisperorchid');
    expect(repaired.unlockedPlants).toContain('eternitybloom');
    expect(repaired.spirits.nocturne.unlocked).toBe(true);
  });

  it('drops unowned placed decorations and invalid achievements', () => {
    const repaired = repairSave(
      {
        decorations: { lantern: true },
        placedDecorations: ['lantern', 'pond'],
        achievementsClaimed: ['firstBloom', 'not-real'],
        chaptersRead: [1, 1, 99, 'two'],
      },
      NOW,
    );
    expect(repaired.placedDecorations).toEqual(['lantern']);
    expect(repaired.achievementsClaimed).toEqual(['firstBloom']);
    expect(repaired.chaptersRead).toEqual([1]);
  });

  it('restores settings and sanitises unknown locales safely', () => {
    const repaired = repairSave(
      {
        settings: { sound: false, music: true, haptics: false, reducedMotion: true, largeText: false },
        locale: 'xx',
      },
      NOW,
    );
    expect(repaired.settings).toEqual({
      sound: false,
      music: true,
      haptics: false,
      reducedMotion: true,
      largeText: false,
    });
    expect(repaired.locale).toBe('xx');
  });
});

describe('save transfer', () => {
  it('exports a marked file and imports it back', () => {
    const save = createNewSave(NOW, 'sv');
    save.dew = 321;
    save.level = 4;
    const text = exportSave(save);
    expect(text).toContain('dream-garden-by-nrnworld');
    const imported = importSave(text, NOW);
    expect(imported).not.toBeNull();
    expect(imported!.dew).toBe(321);
    expect(imported!.level).toBe(4);
    expect(imported!.locale).toBe('sv');
  });

  it('rejects a foreign JSON file', () => {
    expect(importSave('{"hello":"world"}', NOW)).toBeNull();
    expect(importSave('not-json', NOW)).toBeNull();
  });
});
