/**
 * We don't have real row-based spritesheets for these characters yet — just
 * single reference illustrations per character. Rather than fake frame
 * animation we don't have, SpriteAnimator computes an honest procedural
 * transform (bob, squash/stretch, lunge, flash, fade) driven by the exact
 * same timing data (frameRate/totalFrames/currentFrame) that would drive a
 * real spritesheet. Swap in a real sheet later and this same timeline will
 * drive frame indices (see `spriteRow` in motionStates.js) with zero
 * changes to the entities/combat/physics layers.
 */
export function getAnimTransform(entity) {
  const action = entity.currentAction;
  const t = action.totalFrames > 1 ? entity.currentFrame / (action.totalFrames - 1) : 0;
  const wobble = Math.sin((entity.currentFrame + entity.frameTimer / action.frameRate) * Math.PI * 2 * 0.5);

  const transform = {
    offsetX: 0,
    offsetY: 0,
    scaleX: 1,
    scaleY: 1,
    rotation: 0,
    flash: 0,
    opacity: 1,
  };

  switch (entity.currentActionKey) {
    case 'idle':
      transform.offsetY = Math.sin(t * Math.PI * 2) * 2.5;
      transform.scaleY = 1 + Math.sin(t * Math.PI * 2) * 0.01;
      break;
    case 'run':
      transform.offsetY = Math.abs(Math.sin(t * Math.PI * 4)) * 5;
      transform.rotation = Math.sin(t * Math.PI * 4) * 4;
      break;
    case 'jump':
      transform.scaleY = 1.08;
      transform.scaleX = 0.95;
      transform.rotation = -6 * entity.direction;
      break;
    case 'fall':
      transform.scaleY = 0.94;
      transform.scaleX = 1.05;
      transform.offsetY = wobble * 1.5;
      break;
    case 'light_attack':
      transform.offsetX = t * 14 * entity.direction;
      transform.rotation = t * 10 * entity.direction;
      transform.scaleX = 1 + t * 0.08;
      break;
    case 'heavy_attack':
      transform.offsetX = t * 20 * entity.direction;
      transform.rotation = t * 16 * entity.direction;
      transform.scaleX = 1 + t * 0.14;
      transform.scaleY = 1 - t * 0.05;
      break;
    case 'spin_attack':
      transform.rotation = t * 360;
      transform.scaleX = 1.1;
      transform.scaleY = 1.1;
      break;
    case 'dash':
      transform.offsetX = t * 26 * entity.direction;
      transform.scaleX = 1.25;
      transform.scaleY = 0.85;
      transform.opacity = 0.85;
      break;
    case 'hook':
      transform.offsetX = t * 10 * entity.direction;
      transform.rotation = -8 * entity.direction;
      break;
    case 'hit':
      transform.offsetX = (Math.random() - 0.5) * 6;
      transform.flash = 1 - t;
      break;
    case 'die':
      transform.rotation = t * 80 * entity.direction;
      transform.opacity = 1 - t;
      transform.offsetY = t * 18;
      break;
    default:
      break;
  }

  return transform;
}
