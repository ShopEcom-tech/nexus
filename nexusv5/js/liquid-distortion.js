import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';

/**
 * Liquid Distortion Effect
 * Replaces static images with a Three.js canvas featuring a fluid distortion shader on hover.
 */

class LiquidImage {
    constructor(imageElement) {
        this.image = imageElement;
        this.container = null;
        this.renderer = null;
        this.scene = null;
        this.camera = null;
        this.material = null;
        this.mesh = null;
        this.geometry = null;

        // Animation variables
        this.time = 0;
        this.hover = 0; // 0 to 1
        this.targetHover = 0;
        this.isHovering = false;

        this.init();
    }

    init() {
        // Wait for image to load if not already
        if (this.image.complete) {
            this.setup();
        } else {
            this.image.onload = () => this.setup();
        }
    }

    setup() {
        const rect = this.image.getBoundingClientRect();

        // Create container to hold the canvas
        this.container = document.createElement('div');
        this.container.classList.add('liquid-container');
        this.container.style.width = `${rect.width}px`;
        this.container.style.height = `${rect.height}px`;
        this.container.style.display = 'inline-block';
        this.container.style.position = 'relative';
        this.container.style.overflow = 'hidden';
        this.container.style.borderRadius = getComputedStyle(this.image).borderRadius;

        // Insert container and move image inside (hidden)
        this.image.parentNode.insertBefore(this.container, this.image);
        this.container.appendChild(this.image);
        this.image.style.opacity = '0'; // Hide original image but keep it for sizing
        this.image.style.position = 'absolute';
        this.image.style.zIndex = '-1';

        // Scene Setup
        this.scene = new THREE.Scene();

        // Camera
        const aspect = rect.width / rect.height;
        this.camera = new THREE.OrthographicCamera(
            -0.5, 0.5, 0.5, -0.5, 0.01, 10
        );
        this.camera.position.z = 1;

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });
        this.renderer.setSize(rect.width, rect.height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);

        // Fix Canvas Styling
        this.renderer.domElement.style.width = '100%';
        this.renderer.domElement.style.height = '100%';
        this.renderer.domElement.style.position = 'absolute';
        this.renderer.domElement.style.top = '0';
        this.renderer.domElement.style.left = '0';

        // Texture
        const texture = new THREE.TextureLoader().load(this.image.src);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;

        // Geometry
        this.geometry = new THREE.PlaneGeometry(1, 1, 32, 32);

        // Custom Shader Material
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                uTexture: { value: texture },
                uHover: { value: 0 },
                uTime: { value: 0 },
                uResolution: { value: new THREE.Vector2(rect.width, rect.height) }
            },
            vertexShader: `
                varying vec2 vUv;
                uniform float uHover;
                uniform float uTime;

                void main() {
                    vUv = uv;
                    vec3 pos = position;
                    
                    // Simple sine wave distortion on hover
                    if (uHover > 0.0) {
                        float noise = sin(pos.y * 10.0 + uTime * 2.0) * 0.02 * uHover;
                        pos.x += noise;
                        pos.y += sin(pos.x * 10.0 + uTime * 2.0) * 0.02 * uHover;
                    }

                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D uTexture;
                uniform float uHover;
                uniform float uTime;
                varying vec2 vUv;

                void main() {
                    vec2 uv = vUv;

                    // Liquid distortion effect
                    if (uHover > 0.0) {
                        // Create wave/liquid movement
                        float wave = sin(uv.y * 10.0 + uTime) * 0.03 * uHover;
                        float wave2 = cos(uv.x * 12.0 + uTime * 1.5) * 0.02 * uHover;
                        
                        uv.x += wave;
                        uv.y += wave2;
                    }

                    // RGB Shift for glitchy premium feel
                    float r = texture2D(uTexture, uv + vec2(0.005 * uHover, 0.0)).r;
                    float g = texture2D(uTexture, uv).g;
                    float b = texture2D(uTexture, uv - vec2(0.005 * uHover, 0.0)).b;

                    gl_FragColor = vec4(r, g, b, 1.0);
                }
            `,
            transparent: true
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.mesh);

        // Event Listeners
        this.container.addEventListener('mouseenter', () => {
            this.isHovering = true;
            this.targetHover = 1;
        });

        this.container.addEventListener('mouseleave', () => {
            this.isHovering = false;
            this.targetHover = 0;
        });

        // Start Animation Loop
        this.animate();
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        // Smooth hover transition
        this.hover += (this.targetHover - this.hover) * 0.08;
        this.time += 0.05;

        if (this.material) {
            this.material.uniforms.uHover.value = this.hover;
            this.material.uniforms.uTime.value = this.time;
        }

        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }
}

// Initialize on all elements with data-liquid attribute
document.addEventListener('DOMContentLoaded', () => {
    // We delay slightly to ensure images are laid out
    setTimeout(() => {
        const liquidImages = document.querySelectorAll('[data-liquid]');
        liquidImages.forEach(img => {
            new LiquidImage(img);
        });
        console.log(`🌊 Liquid Distortion initialized on ${liquidImages.length} images`);
    }, 500);
});
