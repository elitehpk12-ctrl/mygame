// Central asset registry — every image the game uses is imported once here
// and looked up by string key elsewhere (config/mapConfig.json, entities, HUD).
// This keeps Vite's bundler in charge of hashing/optimizing the files while
// letting the rest of the codebase stay data-driven.

import heroIdle from './characters/hero/kael_idle.png';
import heroAction1 from './characters/hero/kael_action_1.png';
import heroAction2 from './characters/hero/kael_action_2.png';
import heroAction3 from './characters/hero/kael_action_3.png';
import heroPortrait from './characters/hero/kael_portrait.png';
import heroReference from './characters/hero/kael_reference.jpg';

import dragonManIdle from './characters/dragon-man/dragon_man_idle.png';
import dragonManAction from './characters/dragon-man/dragon_man_action.png';
import dragonManPortrait from './characters/dragon-man/dragon_man_portrait.jpg';
import dragonManReference from './characters/dragon-man/dragon_man_reference.jpg';

import zombieIdle from './characters/zombie/zombie_idle.png';
import zombieAction from './characters/zombie/zombie_action.png';
import zombiePortrait from './characters/zombie/zombie_portrait.png';
import zombieReference from './characters/zombie/zombie_reference.jpg';

import levelForest from './backgrounds/level_forest.jpg';
import levelTemple from './backgrounds/level_temple.jpg';
import levelWaterways from './backgrounds/level_waterways.jpg';
import levelExtra from './backgrounds/level_extra.jpg';

import island01 from './worldmap/island_01.png';
import island02 from './worldmap/island_02.png';
import island03 from './worldmap/island_03.png';
import island04 from './worldmap/island_04.png';
import island05 from './worldmap/island_05.png';
import island06 from './worldmap/island_06.png';
import island07 from './worldmap/island_07.png';

export const CHARACTER_ART = {
  hero: {
    idle: heroIdle,
    action: heroAction1,
    action2: heroAction2,
    action3: heroAction3,
    portrait: heroPortrait,
    reference: heroReference,
  },
  dragon_man: {
    idle: dragonManIdle,
    action: dragonManAction,
    portrait: dragonManPortrait,
    reference: dragonManReference,
  },
  zombie: {
    idle: zombieIdle,
    action: zombieAction,
    portrait: zombiePortrait,
    reference: zombieReference,
  },
  // "other" enemies have no bespoke art yet — rendered procedurally
  // (see Renderer.js drawProceduralEnemy) until real art is dropped in.
  other: null,
};

export const BACKGROUND_ART = {
  level_forest: levelForest,
  level_temple: levelTemple,
  level_waterways: levelWaterways,
  level_extra: levelExtra,
};

export const WORLDMAP_ART = {
  island_01: island01,
  island_02: island02,
  island_03: island03,
  island_04: island04,
  island_05: island05,
  island_06: island06,
  island_07: island07,
};
