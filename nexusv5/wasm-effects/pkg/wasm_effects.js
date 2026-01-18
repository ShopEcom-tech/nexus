let wasm;

let cachedDataViewMemory0 = null;
function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return decodeText(ptr, len);
}

let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }
    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = cachedTextEncoder.encodeInto(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

const cachedTextEncoder = new TextEncoder();

if (!('encodeInto' in cachedTextEncoder)) {
    cachedTextEncoder.encodeInto = function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    }
}

let WASM_VECTOR_LEN = 0;

const FluidSimulatorFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => { }, unregister: () => { } }
    : new FinalizationRegistry(ptr => wasm.__wbg_fluidsimulator_free(ptr >>> 0, 1));

const ParticleSystemFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => { }, unregister: () => { } }
    : new FinalizationRegistry(ptr => wasm.__wbg_particlesystem_free(ptr >>> 0, 1));

/**
 * ==========================================
 * FLUID SIMULATION (Navier-Stokes based)
 * ==========================================
 */
export class FluidSimulator {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        FluidSimulatorFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_fluidsimulator_free(ptr, 0);
    }
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} amount
     */
    add_density(x, y, amount) {
        wasm.fluidsimulator_add_density(this.__wbg_ptr, x, y, amount);
    }
    /**
     * @returns {number}
     */
    density_ptr() {
        const ret = wasm.fluidsimulator_density_ptr(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} amount_x
     * @param {number} amount_y
     */
    add_velocity(x, y, amount_x, amount_y) {
        wasm.fluidsimulator_add_velocity(this.__wbg_ptr, x, y, amount_x, amount_y);
    }
    /**
     * @param {number} size
     * @param {number} dt
     * @param {number} diffusion
     * @param {number} viscosity
     */
    constructor(size, dt, diffusion, viscosity) {
        const ret = wasm.fluidsimulator_new(size, dt, diffusion, viscosity);
        this.__wbg_ptr = ret >>> 0;
        FluidSimulatorFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    step() {
        wasm.fluidsimulator_step(this.__wbg_ptr);
    }
    /**
     * @returns {number}
     */
    vx_ptr() {
        const ret = wasm.fluidsimulator_vx_ptr(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    vy_ptr() {
        const ret = wasm.fluidsimulator_vy_ptr(this.__wbg_ptr);
        return ret >>> 0;
    }
}
if (Symbol.dispose) FluidSimulator.prototype[Symbol.dispose] = FluidSimulator.prototype.free;

/**
 * High-performance particle system running in WebAssembly
 * V2: Intelligent flow that avoids center content
 */
export class ParticleSystem {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ParticleSystemFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_particlesystem_free(ptr, 0);
    }
    /**
     * Get pointer to colors array
     * @returns {number}
     */
    colors_ptr() {
        const ret = wasm.fluidsimulator_vx_ptr(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Get pointer to positions array for Three.js
     * @returns {number}
     */
    positions_ptr() {
        const ret = wasm.fluidsimulator_density_ptr(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Create a new particle system with intelligent distribution
     * @param {number} count
     */
    constructor(count) {
        const ret = wasm.particlesystem_new(count);
        this.__wbg_ptr = ret >>> 0;
        ParticleSystemFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Get current time
     * @returns {number}
     */
    time() {
        const ret = wasm.particlesystem_time(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get particle count
     * @returns {number}
     */
    count() {
        const ret = wasm.particlesystem_count(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Update all particles - orbital flow around edges + Fluid Coupling
     * @param {number} delta_time
     * @param {number} mouse_x
     * @param {number} mouse_y
     * @param {number} fluid_vx_ptr
     * @param {number} fluid_vy_ptr
     * @param {number} fluid_size
     */
    update(delta_time, mouse_x, mouse_y, fluid_vx_ptr, fluid_vy_ptr, fluid_size) {
        wasm.particlesystem_update(this.__wbg_ptr, delta_time, mouse_x, mouse_y, fluid_vx_ptr, fluid_vy_ptr, fluid_size);
    }
    /**
     * Get pointer to sizes array
     * @returns {number}
     */
    sizes_ptr() {
        const ret = wasm.fluidsimulator_vy_ptr(this.__wbg_ptr);
        return ret >>> 0;
    }
}
if (Symbol.dispose) ParticleSystem.prototype[Symbol.dispose] = ParticleSystem.prototype.free;

/**
 * Initialize the module with panic hook
 */
export function init_hooks() {
    wasm.init_hooks();
}

const EXPECTED_RESPONSE_TYPES = new Set(['basic', 'cors', 'default']);

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);
            } catch (e) {
                const validResponse = module.ok && EXPECTED_RESPONSE_TYPES.has(module.type);

                if (validResponse && module.headers.get('Content-Type') !== 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);
    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };
        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg___wbindgen_throw_dd24417ed36fc46e = function (arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbg_error_7534b8e9a36f1ab4 = function (arg0, arg1) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg0;
            deferred0_1 = arg1;
            console.error(getStringFromWasm0(arg0, arg1));
        } finally {
            wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
        }
    };
    imports.wbg.__wbg_new_8a6f238a6ece86ea = function () {
        const ret = new Error();
        return ret;
    };
    imports.wbg.__wbg_random_cc1f9237d866d212 = function () {
        const ret = Math.random();
        return ret;
    };
    imports.wbg.__wbg_stack_0ed75d68575b0f3c = function (arg0, arg1) {
        const ret = arg1.stack;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbindgen_init_externref_table = function () {
        const table = wasm.__wbindgen_externrefs;
        const offset = table.grow(4);
        table.set(0, undefined);
        table.set(offset + 0, undefined);
        table.set(offset + 1, null);
        table.set(offset + 2, true);
        table.set(offset + 3, false);
    };

    return imports;
}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedDataViewMemory0 = null;
    cachedUint8ArrayMemory0 = null;


    wasm.__wbindgen_start();
    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (typeof module !== 'undefined') {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({ module } = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();
    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }
    const instance = new WebAssembly.Instance(module, imports);
    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (typeof module_or_path !== 'undefined') {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({ module_or_path } = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (typeof module_or_path === 'undefined') {
        module_or_path = new URL('wasm_effects_bg.wasm?v=5', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync };
export default __wbg_init;
