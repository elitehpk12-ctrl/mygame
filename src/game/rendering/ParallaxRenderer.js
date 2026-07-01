const bgImageCache = new Map();

function getImage(src) {
  if (!bgImageCache.has(src)) {
    const img = new Image();
    img.src = src;
    bgImageCache.set(src, img);
  }
  return bgImageCache.get(src);
}

/**
 * Draws a single background image with a parallax scroll factor < 1 so it
 * moves slower than the camera, then repeats it horizontally to cover the
 * full level width without stretching.
 */
export function drawParallaxBackground(ctx, src, camera, viewWidth, viewHeight, factor = 0.35) {
  const img = getImage(src);
  if (!img.complete || img.naturalWidth === 0) return;

  const scale = viewHeight / img.naturalHeight;
  const tileWidth = img.naturalWidth * scale;
  const scrollX = -(camera.x * factor) % tileWidth;

  let startX = scrollX - tileWidth;
  while (startX < viewWidth) {
    ctx.drawImage(img, startX, 0, tileWidth, viewHeight);
    startX += tileWidth;
  }
}

export function drawDecoration(ctx, decor, camera, time) {
  const parallax = decor.parallaxFactor ?? 0.5;
  const screenX = decor.x - camera.x * parallax - camera.x * (1 - parallax);
  const screenY = decor.y - camera.y;
  const bob = Math.sin(time / 600 + decor.x * 0.01) * 4;

  ctx.save();
  ctx.translate(screenX, screenY + bob);

  switch (decor.type) {
    case 'firefly_spawner':
    case 'glowing_spores': {
      ctx.fillStyle = 'rgba(180, 255, 220, 0.85)';
      for (let i = 0; i < 5; i++) {
        const a = time / 800 + i;
        ctx.beginPath();
        ctx.arc(Math.cos(a) * 18, Math.sin(a * 1.3) * 14, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case 'glowing_tree': {
      ctx.fillStyle = 'rgba(90, 200, 160, 0.18)';
      ctx.beginPath();
      ctx.arc(0, 0, 60, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'water_fountain': {
      ctx.strokeStyle = 'rgba(140, 210, 255, 0.5)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -40 - bob);
      ctx.stroke();
      break;
    }
    case 'ember_vents': {
      ctx.fillStyle = 'rgba(255, 130, 60, 0.35)';
      ctx.beginPath();
      ctx.ellipse(0, 0, 40, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    default: {
      ctx.fillStyle = 'rgba(255,255,255,0.08)';
      ctx.beginPath();
      ctx.arc(0, 0, 20, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}
