/* tslint:disable */
/* eslint-disable */

export class FluidSimulator {
  free(): void;
  [Symbol.dispose](): void;
  add_density(x: number, y: number, amount: number): void;
  density_ptr(): number;
  add_velocity(x: number, y: number, amount_x: number, amount_y: number): void;
  constructor(size: number, dt: number, diffusion: number, viscosity: number);
  step(): void;
  vx_ptr(): number;
  vy_ptr(): number;
}

export class ParticleSystem {
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Get pointer to colors array
   */
  colors_ptr(): number;
  /**
   * Get pointer to positions array for Three.js
   */
  positions_ptr(): number;
  /**
   * Create a new particle system with intelligent distribution
   */
  constructor(count: number);
  /**
   * Get current time
   */
  time(): number;
  /**
   * Get particle count
   */
  count(): number;
  /**
   * Update all particles - orbital flow around edges + Fluid Coupling
   */
  update(delta_time: number, mouse_x: number, mouse_y: number, fluid_vx_ptr: number, fluid_vy_ptr: number, fluid_size: number): void;
  /**
   * Get pointer to sizes array
   */
  sizes_ptr(): number;
}

/**
 * Initialize the module with panic hook
 */
export function init_hooks(): void;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_fluidsimulator_free: (a: number, b: number) => void;
  readonly __wbg_particlesystem_free: (a: number, b: number) => void;
  readonly fluidsimulator_add_density: (a: number, b: number, c: number, d: number) => void;
  readonly fluidsimulator_add_velocity: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly fluidsimulator_density_ptr: (a: number) => number;
  readonly fluidsimulator_new: (a: number, b: number, c: number, d: number) => number;
  readonly fluidsimulator_step: (a: number) => void;
  readonly fluidsimulator_vx_ptr: (a: number) => number;
  readonly fluidsimulator_vy_ptr: (a: number) => number;
  readonly particlesystem_count: (a: number) => number;
  readonly particlesystem_new: (a: number) => number;
  readonly particlesystem_time: (a: number) => number;
  readonly particlesystem_update: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => void;
  readonly init_hooks: () => void;
  readonly particlesystem_colors_ptr: (a: number) => number;
  readonly particlesystem_positions_ptr: (a: number) => number;
  readonly particlesystem_sizes_ptr: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_externrefs: WebAssembly.Table;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
