/* tslint:disable */
/* eslint-disable */
export const memory: WebAssembly.Memory;
export const __wbg_fluidsimulator_free: (a: number, b: number) => void;
export const __wbg_particlesystem_free: (a: number, b: number) => void;
export const fluidsimulator_add_density: (a: number, b: number, c: number, d: number) => void;
export const fluidsimulator_add_velocity: (a: number, b: number, c: number, d: number, e: number) => void;
export const fluidsimulator_density_ptr: (a: number) => number;
export const fluidsimulator_new: (a: number, b: number, c: number, d: number) => number;
export const fluidsimulator_step: (a: number) => void;
export const fluidsimulator_vx_ptr: (a: number) => number;
export const fluidsimulator_vy_ptr: (a: number) => number;
export const particlesystem_count: (a: number) => number;
export const particlesystem_new: (a: number) => number;
export const particlesystem_time: (a: number) => number;
export const particlesystem_update: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => void;
export const init_hooks: () => void;
export const particlesystem_colors_ptr: (a: number) => number;
export const particlesystem_positions_ptr: (a: number) => number;
export const particlesystem_sizes_ptr: (a: number) => number;
export const __wbindgen_free: (a: number, b: number, c: number) => void;
export const __wbindgen_malloc: (a: number, b: number) => number;
export const __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
export const __wbindgen_externrefs: WebAssembly.Table;
export const __wbindgen_start: () => void;
