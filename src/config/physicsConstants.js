export const PHYSICS = {
  gravity: 0.62,
  maxFallSpeed: 18,
  moveSpeed: 4.4,
  airControl: 0.65,
  friction: 0.82,
  jumpVelocity: -12.6,
  coyoteTimeMs: 110,
  jumpBufferMs: 130,
};

export const PLATFORM_TYPES = {
  // fully solid on every side
  solid_ground: { solid: true, oneWay: false, friction: 0.82 },
  brick_wall_left: { solid: true, oneWay: false, friction: 0.82 },
  ruin_ledge: { solid: true, oneWay: true, friction: 0.82 },
  // one-way: you can jump up through it, but land on top of it
  floating: { solid: true, oneWay: true, friction: 0.86 },
  waterways_floor: { solid: true, oneWay: false, friction: 0.6 },
};

export function getPlatformBehavior(type) {
  return PLATFORM_TYPES[type] || { solid: true, oneWay: false, friction: 0.82 };
}
