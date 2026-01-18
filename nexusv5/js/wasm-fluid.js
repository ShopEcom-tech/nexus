import init, { FluidSimulator } from '../wasm-effects/pkg/wasm_effects.js?v=2';

console.log('🌊 WasmFluid module loaded');

export class WasmFluid {
    constructor(canvasId, size = 128, config = {}) {
        console.log('🌊 WasmFluid constructor called');
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error(`Canvas ${canvasId} not found`);
            return;
        }

        // Expose for coupling
        window.fluidInstance = this;

        this.size = size;
        this.config = {
            color: config.color || [168, 85, 247], // Default Purple
            ...config
        };

        this.ctx = this.canvas.getContext('2d');

        // Scale canvas for performance (fluid sim is lower res than screen)
        this.canvas.width = size;
        this.canvas.height = size;

        // CSS handles the visual scaling up
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.imageRendering = 'pixelated'; // Retro/Cyberpunk look

        this.simulator = null;
        this.imageData = this.ctx.createImageData(size, size);

        this.isHovering = false;
        this.lastX = 0;
        this.lastY = 0;

        this.init();
    }

    async init() {
        try {
            // Store the wasm instance to access memory later
            this.wasm = await init();

            // Enable better error messages from Rust
            if (this.wasm.init_hooks) {
                this.wasm.init_hooks();
            }

            // diff, visc
            this.simulator = new FluidSimulator(this.size, 0.1, 0.0001, 0.0001);

            this.setupinteraction();
            this.animate();

            console.log('💧 Rust Fluid Simulator initialized');
        } catch (err) {
            console.error('Failed to init fluid:', err);
        }
    }

    setupinteraction() {
        const container = this.canvas.parentElement || document.body;

        // Mouse Move
        container.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.handleInput(e.clientX, e.clientY, rect);
        });

        container.addEventListener('mouseleave', () => {
            this.isHovering = false;
        });

        // Touch Support
        container.addEventListener('touchstart', (e) => {
            // Prevent scrolling when touching canvas if desired, but maybe better to allow it
            // e.preventDefault(); 
            this.isHovering = false; // Reset for new touch
        }, { passive: true });

        container.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                const rect = this.canvas.getBoundingClientRect();
                const touch = e.touches[0];
                this.handleInput(touch.clientX, touch.clientY, rect);
            }
        }, { passive: true });

        // Scroll Reactivity
        let lastScrollY = window.scrollY;
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            const delta = currentScrollY - lastScrollY;
            lastScrollY = currentScrollY;

            // Inject upward/downward velocity based on scroll
            if (Math.abs(delta) > 1 && this.simulator) {
                const centerX = Math.floor(this.size / 2);
                const bottomY = this.size - 5;

                // Add velocity at the bottom/center
                // Scaling factor for visibility
                const strength = delta * 0.5;

                // Inject a line of velocity at the bottom
                for (let x = 0; x < this.size; x += 2) {
                    this.simulator.add_velocity(x, bottomY, 0, -strength);
                    if (Math.random() > 0.9) {
                        this.simulator.add_density(x, bottomY, Math.abs(strength) * 5);
                    }
                }
            }
        });
    }

    handleInput(clientX, clientY, rect) {
        // Map input to simulation grid coordinates
        const x = Math.floor(((clientX - rect.left) / rect.width) * this.size);
        const y = Math.floor(((clientY - rect.top) / rect.height) * this.size);

        if (x > 0 && x < this.size && y > 0 && y < this.size) {
            if (this.isHovering) {
                // Inject velocity based on movement
                const amtX = (x - this.lastX) * 5.0;
                const amtY = (y - this.lastY) * 5.0;
                this.simulator.add_velocity(x, y, amtX, amtY);
            }

            // Always inject density on hover
            this.simulator.add_density(x, y, 100.0);

            this.lastX = x;
            this.lastY = y;
            this.isHovering = true;
        } else {
            this.isHovering = false;
        }
    }
    // Method removed from here to include subsequent methods in class

    draw() {
        if (!this.simulator || !this.wasm) return;

        const densityPtr = this.simulator.density_ptr();
        const size = this.size;

        // Access WASM memory
        const memoryBuffer = this.wasm.memory.buffer;
        const densityArray = new Float32Array(memoryBuffer, densityPtr, size * size);

        // Update Canvas ImageData
        const data = this.imageData.data;
        const [r, g, b] = this.config.color;

        for (let i = 0; i < size * size; i++) {
            const density = densityArray[i];
            const alpha = Math.min(density * 255, 255);

            // Index for RGBA
            const j = i * 4;

            // Color: Electric Purple/Blue (Cyberpunk)
            // R: 168 (0xA8)
            // G: 85  (0x55) 
            // B: 247 (0xF7)
            data[j] = r;     // R
            data[j + 1] = g;  // G
            data[j + 2] = b; // B
            data[j + 3] = alpha; // A
        }

        this.ctx.putImageData(this.imageData, 0, 0);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        if (!this.simulator) return;

        try {
            // 1. Simulation step in Rust
            this.simulator.step();

            // 2. Render to Canvas
            this.draw();
        } catch (err) {
            console.error('💥 Fluid simulation crashed:', err);
            this.simulator = null; // Stop simulation
        }
    }
}
