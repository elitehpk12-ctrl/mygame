export class Camera {
  constructor(viewWidth, viewHeight) {
    this.x = 0;
    this.y = 0;
    this.viewWidth = viewWidth;
    this.viewHeight = viewHeight;
  }

  follow(target, level, smoothing = 0.12) {
    const desiredX = target.centerX - this.viewWidth / 2;
    const desiredY = target.centerY - this.viewHeight / 2;

    this.x += (desiredX - this.x) * smoothing;
    this.y += (desiredY - this.y) * smoothing;

    const maxX = Math.max(0, level.dimensions.width - this.viewWidth);
    const maxY = Math.max(0, level.dimensions.height - this.viewHeight);
    this.x = Math.max(0, Math.min(this.x, maxX));
    this.y = Math.max(0, Math.min(this.y, maxY));
  }
}
