import { useEffect, useRef } from 'react';
import { Engine } from '../game/core/Engine.js';
import { usePlayerStore } from '../state/usePlayerStore.js';
import { useLevelStore } from '../state/useLevelStore.js';
import { useGameStore } from '../state/useGameStore.js';

/**
 * Mounts the framework-agnostic game Engine onto a <canvas>. This component
 * never touches game logic directly — it only owns the DOM canvas element
 * and the Engine's lifecycle (create on mount, load level on change,
 * destroy on unmount).
 */
export default function GameCanvas({ levelId }) {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 1280;
    canvas.height = 720;

    const engine = new Engine(canvas, {
      playerStore: usePlayerStore,
      levelStore: useLevelStore,
      gameStore: useGameStore,
    });
    engineRef.current = engine;
    engine.loadLevel(levelId);
    engine.start();

    useGameStore.getState().bindEngineActions({
      attack: () => engine.triggerAction('attack'),
      heavyAttack: () => engine.triggerAction('heavyAttack'),
      dash: () => engine.triggerAction('dash'),
      hook: () => engine.triggerAction('hook'),
      spinAttack: () => engine.triggerAction('spinAttack'),
      healPotion: () => engine.triggerAction('healPotion'),
    });

    return () => {
      useGameStore.getState().bindEngineActions(null);
      engine.destroy();
      engineRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (engineRef.current && levelId != null) {
      engineRef.current.loadLevel(levelId);
    }
  }, [levelId]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full object-cover"
      style={{ imageRendering: 'pixelated' }}
    />
  );
}
