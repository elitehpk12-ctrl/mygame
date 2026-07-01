import { GameLoop } from './GameLoop.js';
import { Camera } from './Camera.js';
import { InputManager } from '../input/InputManager.js';
import { stepPhysics, clampToLevel } from '../physics/Physics.js';
import { resolveCombat } from '../combat/CombatSystem.js';
import { renderFrame } from '../rendering/Renderer.js';
import { Player } from '../entities/Player.js';
import { getLevelById, instantiateEnemies } from '../levels/LevelLoader.js';

const STORE_SYNC_INTERVAL_MS = 80; // ~12hz — plenty smooth for HUD numbers, cheap on React

export class Engine {
  /**
   * @param canvas HTMLCanvasElement
   * @param stores { playerStore, levelStore, gameStore } zustand store hooks (`.getState()` used)
   */
  constructor(canvas, stores) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.stores = stores;
    this.viewWidth = canvas.width;
    this.viewHeight = canvas.height;

    this.input = new InputManager(window);
    this.camera = new Camera(this.viewWidth, this.viewHeight);
    this.loop = new GameLoop({ update: this._update, render: this._render });

    this.level = null;
    this.player = null;
    this.enemies = [];
    this._syncTimer = 0;
    this._escapeLatch = false;
    this._potionLatch = false;
  }

  loadLevel(levelId) {
    this.level = getLevelById(levelId);
    this.enemies = instantiateEnemies(this.level);
    this.player = new Player({ x: this.level.spawnPoint.x, y: this.level.spawnPoint.y });
    this.camera.x = Math.max(0, this.player.x - this.viewWidth / 2);
    this.camera.y = 0;

    const { gameStore, levelStore, playerStore } = this.stores;
    gameStore.getState().startLevel(levelId);
    gameStore.getState().pushLogBatch(this.level.log || []);
    levelStore.getState().syncFromLevel(this.level, this.enemies);
    playerStore.getState().syncFromEntity(this.player);
  }

  start() {
    this.input.attach();
    this.loop.start();
  }

  stop() {
    this.loop.stop();
    this.input.detach();
  }

  _update = (dt) => {
    const { gameStore } = this.stores;
    if (gameStore.getState().paused || gameStore.getState().screen !== 'combat') {
      this.input.endFrame();
      return;
    }
    if (!this.player || !this.player.alive) {
      if (this.player && !this.player.alive) {
        this.player.tickAnimation();
      }
      this._maybeEndRun();
      this.input.endFrame();
      return;
    }

    // pause key
    if (this.input.wasPressed('pause')) {
      gameStore.getState().togglePause();
    }
    if (this.input.wasPressed('healPotion')) {
      const healed = this.player.usePotion();
      if (healed) gameStore.getState().pushLog('You drink a Heal Potion.');
    }

    this.player.handleInput(this.input, dt, this.enemies);
    this.player.tickAnimation();
    stepPhysics(this.player, this.level.platforms, dt);
    clampToLevel(this.player, this.level);

    for (const enemy of this.enemies) {
      if (enemy.alive) {
        enemy.update(this.player, dt);
        stepPhysics(enemy, this.level.platforms, dt);
        clampToLevel(enemy, this.level);
      }
    }

    const events = resolveCombat(this.player, this.enemies);
    if (events.length) gameStore.getState().pushLogBatch(events);

    this.camera.follow(this.player, this.level);

    this._maybeEndRun();

    this._syncTimer += dt;
    if (this._syncTimer >= STORE_SYNC_INTERVAL_MS) {
      this._syncTimer = 0;
      this.stores.playerStore.getState().syncFromEntity(this.player);
      this.stores.levelStore.getState().syncFromLevel(this.level, this.enemies);
    }

    this.input.endFrame();
  };

  _maybeEndRun() {
    const { gameStore } = this.stores;
    if (this.player && !this.player.alive && gameStore.getState().screen === 'combat') {
      gameStore.getState().setOutcome('defeat');
      return;
    }
    const allDead = this.enemies.length > 0 && this.enemies.every((e) => !e.alive);
    if (allDead && gameStore.getState().screen === 'combat') {
      gameStore.getState().setOutcome('victory');
    }
  }

  _render = (time) => {
    if (!this.level || !this.player) return;
    renderFrame(this.ctx, {
      level: this.level,
      player: this.player,
      enemies: this.enemies,
      camera: this.camera,
      time,
      viewWidth: this.viewWidth,
      viewHeight: this.viewHeight,
    });
  };

  /** Lets HUD buttons (Attack / Heal Potion / skill icons) drive the same input path as keys. */
  triggerAction(action) {
    this.input.simulatePress(action);
  }

  destroy() {
    this.stop();
  }
}
