import type { DecoDef, DecoId, SpiritDef, SpiritId } from '../types';

export const SPIRITS: Record<SpiritId, SpiritDef> = {
  mossling: {
    id: 'mossling',
    element: 'moss',
    unlockLevel: 2,
    passive: 'yield',
    power: 0.04,
    palette: {
      petal: '#b9f0c4',
      petalDeep: '#71c98c',
      core: '#f2ffe0',
      stem: '#4f9e6c',
      leaf: '#86d9a1',
      glow: '#aef7c4',
    },
  },
  tidewhisper: {
    id: 'tidewhisper',
    element: 'tide',
    unlockLevel: 4,
    passive: 'dew',
    power: 0.05,
    palette: {
      petal: '#b5e9ff',
      petalDeep: '#6db9e8',
      core: '#eaffff',
      stem: '#4a8fa8',
      leaf: '#91d6e7',
      glow: '#8fe3ff',
    },
  },
  emberling: {
    id: 'emberling',
    element: 'ember',
    unlockLevel: 7,
    passive: 'growth',
    power: 0.04,
    palette: {
      petal: '#ffd6a0',
      petalDeep: '#f09a55',
      core: '#fff3d0',
      stem: '#a4713f',
      leaf: '#e5b174',
      glow: '#ffbe7d',
    },
  },
  starling: {
    id: 'starling',
    element: 'star',
    unlockLevel: 10,
    passive: 'stardust',
    power: 0.018,
    palette: {
      petal: '#f6e6a8',
      petalDeep: '#b39cf0',
      core: '#fffbe8',
      stem: '#6d6399',
      leaf: '#cbc0f2',
      glow: '#ffe9a8',
    },
  },
  petalwisp: {
    id: 'petalwisp',
    element: 'petal',
    unlockLevel: 13,
    passive: 'orders',
    power: 0.06,
    palette: {
      petal: '#ffd0e3',
      petalDeep: '#ee9dc0',
      core: '#fff0c9',
      stem: '#b4778f',
      leaf: '#f3b6ce',
      glow: '#ffb6d5',
    },
  },
  nocturne: {
    id: 'nocturne',
    element: 'moon',
    unlockLevel: 16,
    passive: 'xp',
    power: 0.06,
    palette: {
      petal: '#dfe4ff',
      petalDeep: '#8f93d8',
      core: '#ffffff',
      stem: '#5f6498',
      leaf: '#a9b0e8',
      glow: '#b9c2ff',
    },
  },
};

export const SPIRIT_ORDER: SpiritId[] = [
  'mossling',
  'tidewhisper',
  'emberling',
  'starling',
  'petalwisp',
  'nocturne',
];

/** Essence required to raise a spirit from `bond` to `bond + 1`. */
export function bondCost(bond: number): number {
  return 40 + bond * 65;
}

export const MAX_BOND = 5;
export const MAX_EQUIPPED = 3;

export const DECORATIONS: Record<DecoId, DecoDef> = {
  lantern: { id: 'lantern', cost: 90, harmony: 3, unlockLevel: 1, slot: 'left-back' },
  pond: { id: 'pond', cost: 260, harmony: 5, unlockLevel: 3, slot: 'right-back' },
  arch: { id: 'arch', cost: 700, harmony: 8, unlockLevel: 6, slot: 'left-mid' },
  bench: { id: 'bench', cost: 1500, harmony: 10, unlockLevel: 9, slot: 'right-mid' },
  mushrooms: { id: 'mushrooms', cost: 3200, harmony: 14, unlockLevel: 12, slot: 'left-front' },
  chimes: { id: 'chimes', cost: 6000, harmony: 18, unlockLevel: 15, slot: 'right-front' },
};

export const DECO_ORDER: DecoId[] = ['lantern', 'pond', 'arch', 'bench', 'mushrooms', 'chimes'];
