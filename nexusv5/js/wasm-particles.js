import init, { ParticleSystem } from '../wasm-effects/pkg/wasm_effects.js';

class WasmParticleSystem {
    constructor(scene, count = 10000) {
        this.scene = scene;
        this.count = count;
        this.system = null;
        this.geometry = null;
        this.points = null;
        this.isInitialized = false;

        // Mouse tracking
        this.mouse = { x: 0, y: 0 };
        window.addEventListener('mousemove', (e) => {
            // Normalize mouse position (-100 to 100 for WASM coordinate system)
            this.mouse.x = (e.clientX / window.innerWidth) * 200 - 100;
            this.mouse.y = -(e.clientY / window.innerHeight) * 200 + 100;
        });

        this.init();
    }

    async init() {
        try {
            // Load the WASM module
            const wasm = await init();

            // Create Rust particle system
            this.system = new ParticleSystem(this.count);

            // Create Three.js geometry
            this.geometry = new THREE.BufferGeometry();

            // Initial positions buffer
            const positionsPtr = this.system.positions_ptr();
            const colorsPtr = this.system.colors_ptr();
            const sizesPtr = this.system.sizes_ptr();

            // Create views into WASM memory
            // Note: We need to re-create these views every frame if memory grows, 
            // but for a fixed size system it's usually stable unless reallocated.
            // For safety in this demo we'll get the memory view each frame or check invalidation.
            const memory = wasm.memory;

            const positionArray = new Float32Array(memory.buffer, positionsPtr, this.count * 3);
            const colorArray = new Float32Array(memory.buffer, colorsPtr, this.count * 3);
            const sizeArray = new Float32Array(memory.buffer, sizesPtr, this.count);

            this.geometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
            this.geometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
            this.geometry.setAttribute('size', new THREE.BufferAttribute(sizeArray, 1));

            // Material
            const textureLoader = new THREE.TextureLoader();
            const sprite = textureLoader.load('https://threejs.org/examples/textures/sprites/spark1.png');

            const material = new THREE.PointsMaterial({
                size: 1.0,
                vertexColors: true,
                map: sprite,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                transparent: true,
                opacity: 0.8,
                sizeAttenuation: true
            });

            // Create Points object
            this.points = new THREE.Points(this.geometry, material);
            this.scene.add(this.points);

            this.isInitialized = true;
            console.log("Rust/WASM Particle System initialized with " + this.count + " particles");

        } catch (err) {
            console.error("Failed to initialize WASM particles:", err);
        }
    }

    update(deltaTime) {
        if (!this.isInitialized || !this.system) return;

        // Update physics in Rust
        let vxPtr = 0;
        let vyPtr = 0;
        let size = 0;

        if (window.fluidInstance && window.fluidInstance.simulator) {
            try {
                vxPtr = window.fluidInstance.simulator.vx_ptr();
                vyPtr = window.fluidInstance.simulator.vy_ptr();
                size = window.fluidInstance.size;
            } catch (e) {
                // Ignore if pointers invalid momentarily
            }
        }

        this.system.update(deltaTime, this.mouse.x, this.mouse.y, vxPtr, vyPtr, size);

        // Sync geometry
        // IMPORTANT: We must flag attributes as needing update
        this.geometry.attributes.position.needsUpdate = true;
        this.geometry.attributes.size.needsUpdate = true;

        // If the WASM memory buffer changed (reallocation), we'd need to recreate the views here.
        // For simple demos without vector resizing, the view usually persists.
    }
}

export default WasmParticleSystem;
