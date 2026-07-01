import { drawParallaxBackground, drawDecoration } from './ParallaxRenderer.js';
import { getAnimTransform } from './SpriteAnimator.js';
import { CHARACTER_ART, BACKGROUND_ART } from '../../assets/index.js';

const spriteCache = new Map();
function getImage(src) {
  if (!src) return null;
  if (!spriteCache.has(src)) {
    const img = new Image();
    img.src = src;
    spriteCache.set(src, img);
  }
  return spriteCache.get(src);
}

function platformColor(type, themeColor) {
  switch (type) {
    case 'solid_ground':
      return themeColor || '#2c3e1f';
    case 'floating':
      return '#3a5a40';
    case 'brick_wall_left':
    case 'ruin_ledge':
      return '#8a6a4a';
    case 'waterways_floor':
      return '#4a3c31';
    default:
      return '#3a5a40';
  }
}

function drawPlatform(ctx, platform, camera, themeColor) {
  const x = platform.x - camera.x;
  const y = platform.y - camera.y;
  ctx.fillStyle = platformColor(platform.type, themeColor);
  ctx.fillRect(x, y, platform.width, platform.height);
  ctx.fillStyle = 'rgba(255,255,255,0.12)';
  ctx.fillRect(x, y, platform.width, 4);
}

function drawEntitySprite(ctx, entity, camera, artKey) {
  const art = CHARACTER_ART[artKey];
  const imgSrc = art ? art.idle : null;
  const img = getImage(imgSrc);
  const transform = getAnimTransform(entity);

  const screenX = entity.x - camera.x + entity.width / 2 + transform.offsetX;
  const screenY = entity.y - camera.y + entity.height / 2 + transform.offsetY;

  ctx.save();
  ctx.globalAlpha = transform.opacity;
  ctx.translate(screenX, screenY);
  ctx.rotate((transform.rotation * Math.PI) / 180);
  ctx.scale(entity.direction * transform.scaleX, transform.scaleY);

  const drawW = entity.width * 1.9; // art has padding/effects baked in, draw slightly larger than hitbox
  const drawH = entity.height * 1.9;

  if (img && img.complete && img.naturalWidth > 0) {
    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
  } else {
    // procedural placeholder (used for "other" enemy type, or while images load)
    ctx.fillStyle = entity.type === 'hero' ? '#c9a24b' : '#8b3a3a';
    ctx.beginPath();
    ctx.arc(0, 0, entity.width / 2, 0, Math.PI * 2);
    ctx.fill();
  }

  if (transform.flash > 0) {
    ctx.globalAlpha = transform.flash * 0.6;
    ctx.fillStyle = '#ff5555';
    ctx.fillRect(-drawW / 2, -drawH / 2, drawW, drawH);
  }

  ctx.restore();
}

function drawHealthBar(ctx, entity, camera) {
  if (!entity.alive) return;
  const w = entity.width;
  const x = entity.x - camera.x;
  const y = entity.y - camera.y - 14;
  const ratio = Math.max(0, entity.hp / entity.maxHp);

  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.fillRect(x, y, w, 6);
  ctx.fillStyle = entity.type === 'hero' ? '#3fa7e6' : '#e6473f';
  ctx.fillRect(x, y, w * ratio, 6);
  ctx.strokeStyle = 'rgba(255,255,255,0.4)';
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, w, 6);

  if (entity.boss) {
    ctx.fillStyle = '#f4c542';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(entity.label, x + w / 2, y - 4);
  }
}

export function renderFrame(ctx, { level, player, enemies, camera, time, viewWidth, viewHeight, debugHitboxes = false }) {
  ctx.clearRect(0, 0, viewWidth, viewHeight);

  // sky gradient fallback beneath the parallax image
  const sky = ctx.createLinearGradient(0, 0, 0, viewHeight);
  sky.addColorStop(0, '#0d1b3d');
  sky.addColorStop(1, level.themeColor || '#1a1030');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, viewWidth, viewHeight);

  const bgSrc = BACKGROUND_ART[level.assets.background];
  if (bgSrc) drawParallaxBackground(ctx, bgSrc, camera, viewWidth, viewHeight, 0.3);

  for (const decor of level.decorations || []) {
    drawDecoration(ctx, decor, camera, time);
  }

  for (const platform of level.platforms) {
    drawPlatform(ctx, platform, camera, level.themeColor);
  }

  for (const enemy of enemies) {
    drawEntitySprite(ctx, enemy, camera, enemy.type);
    drawHealthBar(ctx, enemy, camera);
  }

  drawEntitySprite(ctx, player, camera, 'hero');
  drawHealthBar(ctx, player, camera);

  if (debugHitboxes) {
    ctx.strokeStyle = '#00ff88';
    const ph = player.getAttackHitbox();
    if (ph) {
      ctx.strokeRect(ph.x - camera.x - (ph.radial ? ph.width / 2 : 0), ph.y - camera.y - (ph.radial ? ph.height / 2 : 0), ph.width, ph.height);
    }
  }
}
