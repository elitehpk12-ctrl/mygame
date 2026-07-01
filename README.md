# Forbidden Archipelago

A 2D action-platformer boilerplate built with **React + Vite + Canvas2D + Zustand**,
built around the HUD mockup and art assets from the original prototype
(`Forbidden_ARCHIPELAGO.zip`): Kael Tharion vs. the Dragon-Man and the Zombie,
across a set of floating islands.

## Quick start

```bash
npm install
npm run dev
```

Open the printed local URL (defaults to `http://localhost:5173`).

```bash
npm run build      # production build to dist/
npm run preview    # preview the production build locally
```

## Controls

| Action        | Key(s)              |
|---------------|----------------------|
| Move          | `A`/`D` or `←`/`→`   |
| Jump          | `W`, `↑`, or `Space`  |
| Attack        | `J`                   |
| Heavy Attack  | `K`                   |
| Dash          | `Shift`               |
| Hook          | `F`                   |
| Spin Attack   | `L`                   |
| Heal Potion   | `H`                   |
| Pause         | `Esc` or `P`          |

All Combat Actions / skill icons in the HUD are also clickable and drive the
exact same input path as the keys (see `Engine.triggerAction`).

## Project structure

```
src/
├─ main.jsx, App.jsx, index.css     # React entry + screen router
│
├─ components/                      # React: UI only, never touches canvas internals directly
│  ├─ GameCanvas.jsx                # thin wrapper — mounts/unmounts the Engine on a <canvas>
│  ├─ hud/                          # HP/mana bars, gold, skill cooldowns, world map, enemy group,
│  │                                # combat action buttons, event log — all read from zustand stores
│  ├─ menus/                        # Character sheet, pause menu
│  ├─ worldmap/                     # Island/level-select screen
│  └─ overlays/                     # Loading, victory/defeat screens
│
├─ game/                            # Framework-agnostic engine — no React imports anywhere in here
│  ├─ core/
│  │  ├─ Engine.js                  # bootstraps everything, owns the live Player/Enemy/Level,
│  │  │                             # syncs a throttled snapshot into zustand each ~80ms
│  │  ├─ GameLoop.js                # fixed 60Hz timestep accumulator loop (deterministic logic,
│  │  │                             # smooth render regardless of monitor refresh rate)
│  │  └─ Camera.js                  # follows the player, clamped to level bounds
│  ├─ input/InputManager.js         # keyboard -> action mapping + simulatePress() for HUD buttons
│  ├─ physics/Physics.js            # gravity + per-axis AABB collision resolution, one-way platforms
│  ├─ combat/CombatSystem.js        # hitbox vs hurtbox evaluation (AABB + radial for Spin Attack)
│  ├─ entities/
│  │  ├─ Entity.js                  # base class: action/animation state machine, takeDamage, hitbox calc
│  │  ├─ Player.js                  # movement, skills (Dash/Hook/Spin Attack), cooldowns, potions
│  │  └─ Enemy.js                   # patrol -> chase -> attack finite state AI
│  ├─ rendering/
│  │  ├─ Renderer.js                # draws background, platforms, decorations, entities, HP bars
│  │  ├─ SpriteAnimator.js          # procedural transform animation (see note below)
│  │  └─ ParallaxRenderer.js        # scrolling background + simple decoration effects
│  └─ levels/LevelLoader.js         # reads config/mapConfig.json, instantiates Enemy objects
│
├─ state/                           # Zustand stores — the only bridge between Engine and React
│  ├─ usePlayerStore.js             # hp/mana/gold/cooldowns for the HUD
│  ├─ useLevelStore.js              # current level + enemy-group snapshot for the HUD
│  └─ useGameStore.js               # screen routing, pause, event log, engine-action bridge
│
├─ config/
│  ├─ mapConfig.json                # level list: platforms, decorations, enemy spawns, dimensions
│  ├─ motionStates.js               # action state-machine timings + attack hitbox keyframes
│  └─ physicsConstants.js           # gravity/speed/platform-type tuning
│
└─ assets/
   ├─ index.js                      # central registry — every image imported once, looked up by key
   ├─ characters/{hero,dragon-man,zombie}/
   ├─ backgrounds/                  # level background art
   └─ worldmap/                     # floating-island art for the level-select screen
```

## Architecture notes

**Engine vs. React.** `game/` has zero React imports. `GameCanvas.jsx` is the
only place the two worlds touch: it creates an `Engine`, hands it a canvas
and the three zustand store hooks, and the Engine pushes a throttled
snapshot into those stores (~12 times/sec) so the HUD re-renders cheaply
without coupling render-loop performance to React's reconciler. HUD buttons
call back into the Engine through `useGameStore().engineActions`, which
`GameCanvas` binds on mount — so an on-screen "Attack" button and the `J` key
drive the literal same code path.

**Why animation is "procedural" rather than sprite-sheet based.** The
original asset drop has one high-quality illustration per character, not a
frame-by-frame spritesheet. Rather than fake frames that don't exist,
`SpriteAnimator.js` computes an honest transform (bob, squash/stretch,
attack lunge, hit-flash, death fade) from the *same* timing data
(`frameRate` / `totalFrames` / `currentFrame`) that a real spritesheet would
use. `motionStates.js` already keeps a `spriteRow` per action — drop in a
real row-based spritesheet later and only `Renderer.js`'s `drawEntitySprite`
needs to change (crop by row/frame instead of drawing the whole image);
`Entity`, `Player`, `Enemy`, `CombatSystem`, and `Physics` don't change at all.

**Combat.** Every attack action declares `activeHitboxFrames` (which frames
of the swing actually deal damage) and `hitboxOffsets` (where the hitbox
sits relative to the entity, or a `radial: true` box for Spin Attack's
around-the-player AoE). `CombatSystem.resolveCombat` checks the player's
live hitbox against every enemy hurtbox and vice versa, once per attack
instance (tracked via `Entity._hitEntitiesThisAction` so a single swing
can't multi-hit across frames).

**Enemy Group HUD panel** aggregates live `Enemy` instances by type
(`dragon_man` / `zombie` / `other`) into combined HP bars, matching the
mockup's Dragon-Man / Zombie / Other rows. The `other` bucket has no bespoke
art yet — it renders as a soft glyph placeholder (see `CHARACTER_ART.other`
in `assets/index.js`) until real art exists for those enemy types.

## Extending it

- **New level:** add an entry to `config/mapConfig.json` (platforms,
  decorations, enemies, spawn point) and point `assets.background` at a key
  registered in `assets/index.js`.
- **New enemy type:** add art + a `CHARACTER_ART` entry, then reference the
  type string in a level's `enemies` array. AI behavior is generic
  (patrol/chase/attack) — for special-cased behavior, branch on `type` inside
  `Enemy.update`.
- **New skill:** add an action to `motionStates.js` (with `cooldown` and
  either `keyframes` for an attack or custom fields like `dash`'s `impulse`),
  wire the input key in `InputManager.js`, and handle it in `Player.handleInput`.
- **Real spritesheets:** swap the single reference image per character for a
  sheet, then update `Renderer.drawEntitySprite` to crop by `spriteRow` /
  `currentFrame` instead of drawing the whole source image.

## Credits

Character, enemy, background, and world-map art carried over from the
original project drop (`hero/`, `ennemi 1/`, `ennemi 2/`, `map/`, `îles/`).
HUD layout is a direct implementation of the provided mockup.
