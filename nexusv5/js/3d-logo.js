/* ========================================
   3D PARTICLE MORPHING LOGO
   Advanced particle system that forms the logo
   and disperses on hover.
   ======================================== */

(function () {
    'use strict';

    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initParticleLogo);
    } else {
        initParticleLogo();
    }

    function initParticleLogo() {
        const logoLink = document.querySelector('.navbar-logo');
        if (!logoLink || typeof THREE === 'undefined') return;

        const logoImg = logoLink.querySelector('img');
        if (!logoImg) return;

        // Configuration
        const config = {
            width: 60,
            height: 60,
            density: 2, // Particles per pixel (higher = more detail)
            particleSize: 1.5,
            color: 0xa855f7,
            hoverColor: 0xec4899,
            dispersion: 0.8 // How far particles fly
        };

        // Create Wrapper
        const wrapper = document.createElement('div');
        wrapper.style.cssText = `
            position: relative;
            width: ${config.width}px;
            height: ${config.height}px;
            display: inline-block;
            cursor: pointer;
        `;

        const canvas = document.createElement('canvas');
        canvas.width = config.width;
        canvas.height = config.height;
        canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            pointer-events: none;
        `;

        // Hide original image but keep it for SEO/Loading
        logoImg.style.display = 'none';
        logoImg.parentNode.insertBefore(wrapper, logoImg);
        wrapper.appendChild(logoImg); // Keep in DOM
        wrapper.appendChild(canvas);

        // Scene Setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
        camera.position.z = 100;

        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true
        });
        renderer.setSize(config.width, config.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // State
        let particles = null;
        let isHovering = false;
        let time = 0;

        // Load Texture with robust error handling
        const loader = new THREE.TextureLoader();

        // Use the src directly from the img element to ensuring we get the correct resolved path
        // This handles both root '/' and subdirectories '/pages/' correctly.
        const imgPath = logoImg.src;

        loader.load(
            imgPath,
            (texture) => {
                try {
                    createParticles(texture);
                    animate();
                } catch (e) {
                    console.error('Error causing fallback:', e);
                    revertToImage();
                }
            },
            undefined, // onProgress
            (err) => {
                console.error('Error loading texture, reverting to image:', err);
                revertToImage();
            }
        );

        function revertToImage() {
            // Remove canvas and wrapper, show original image
            if (canvas.parentNode) canvas.parentNode.removeChild(canvas);

            // Move img back out of wrapper if needed, or just show it inside
            logoImg.style.display = 'block';
            logoImg.style.width = '40px';
            logoImg.style.height = '40px';
            logoImg.style.position = 'relative'; // Ensure it's visible

            // If wrapper exists, we can leave it or unwrap. 
            // Unwrapping is safer for layout.
            if (wrapper.parentNode) {
                wrapper.parentNode.insertBefore(logoImg, wrapper);
                wrapper.parentNode.removeChild(wrapper);
            }
        }

        function createParticles(texture) {
            // Draw image to temporary canvas to read pixel data
            const imgParams = { width: 100, height: 100 }; // Simulation resolution
            const tmpCanvas = document.createElement('canvas');
            tmpCanvas.width = imgParams.width;
            tmpCanvas.height = imgParams.height;
            const ctx = tmpCanvas.getContext('2d');
            ctx.drawImage(texture.image, 0, 0, imgParams.width, imgParams.height);

            const imgData = ctx.getImageData(0, 0, imgParams.width, imgParams.height).data;
            const positions = [];
            const origins = []; // Original positions for restoring
            const colors = [];
            const sizes = [];

            // Center offset
            const offsetX = -imgParams.width / 2;
            const offsetY = -imgParams.height / 2;

            let visiblePixels = 0;

            for (let y = 0; y < imgParams.height; y++) {
                for (let x = 0; x < imgParams.width; x++) {
                    const i = (y * imgParams.width + x) * 4;
                    const alpha = imgData[i + 3];

                    // Only create particle if pixel is visible
                    if (alpha > 128) {
                        visiblePixels++;
                        const pX = (x + offsetX) * 0.8; // Scale factor
                        const pY = -(y + offsetY) * 0.8; // Flip Y
                        const pZ = 0;

                        positions.push(pX, pY, pZ);
                        origins.push(pX, pY, pZ);

                        // Color variation
                        colors.push(0.66, 0.33, 0.97); // Base purple normalized
                        sizes.push(Math.random() * config.particleSize);
                    }
                }
            }

            // Sanity check for texture validity (avoid white square glitch)
            const totalPixels = imgParams.width * imgParams.height;
            if (visiblePixels > totalPixels * 0.9) {
                throw new Error('Texture appears to be a solid block (likely 404 page)');
            }
            if (visiblePixels < 10) {
                throw new Error('Texture appears empty');
            }

            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            geometry.setAttribute('origin', new THREE.Float32BufferAttribute(origins, 3));
            geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
            geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

            // Custom Shader Material
            const material = new THREE.ShaderMaterial({
                uniforms: {
                    uTime: { value: 0 },
                    uHover: { value: 0 },
                    uMouse: { value: new THREE.Vector3(0, 0, 0) },
                    uColor1: { value: new THREE.Color(config.color) },
                    uColor2: { value: new THREE.Color(config.hoverColor) }
                },
                vertexShader: `
                    attribute vec3 origin;
                    attribute float size;
                    uniform float uTime;
                    uniform float uHover;
                    uniform vec3 uMouse;
                    varying vec3 vColor;
                    
                    // Simplex noise function
                    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
                    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
                    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
                    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
                    float snoise(vec3 v) { 
                        const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
                        const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
                        vec3 i  = floor(v + dot(v, C.yyy) );
                        vec3 x0 = v - i + dot(i, C.xxx) ;
                        vec3 g = step(x0.yzx, x0.xyz);
                        vec3 l = 1.0 - g;
                        vec3 i1 = min( g.xyz, l.zxy );
                        vec3 i2 = max( g.xyz, l.zxy );
                        vec3 x1 = x0 - i1 + C.xxx;
                        vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
                        vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y
                        i = mod289(i); 
                        vec4 p = permute( permute( permute( 
                                    i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                                + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
                                + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
                        float n_ = 0.142857142857; // 1.0/7.0
                        vec3  ns = n_ * D.wyz - D.xzx;
                        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)
                        vec4 x_ = floor(j * ns.z);
                        vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)
                        vec4 x = x_ *ns.x + ns.yyyy;
                        vec4 y = y_ *ns.x + ns.yyyy;
                        vec4 h = 1.0 - abs(x) - abs(y);
                        vec4 b0 = vec4( x.xy, y.xy );
                        vec4 b1 = vec4( x.zw, y.zw );
                        vec4 s0 = floor(b0)*2.0 + 1.0;
                        vec4 s1 = floor(b1)*2.0 + 1.0;
                        vec4 sh = -step(h, vec4(0.0));
                        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
                        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
                        vec3 p0 = vec3(a0.xy,h.x);
                        vec3 p1 = vec3(a0.zw,h.y);
                        vec3 p2 = vec3(a1.xy,h.z);
                        vec3 p3 = vec3(a1.zw,h.w);
                        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
                        p0 *= norm.x;
                        p1 *= norm.y;
                        p2 *= norm.z;
                        p3 *= norm.w;
                        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
                        m = m * m;
                        return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                                    dot(p2,x2), dot(p3,x3) ) );
                    }

                    void main() {
                        vec3 pos = origin;
                        
                        // Noise movement always present but subtle
                        float noiseVal = snoise(vec3(pos.x * 0.05, pos.y * 0.05, uTime * 0.5));
                        
                        // Explosion logic on hover
                        float dist = distance(pos.xy, uMouse.xy);
                        float repulsion = 1.0 - smoothstep(0.0, 30.0, dist);
                        
                        // Add organic movement
                        pos += normal * noiseVal * (0.5 + uHover * 5.0);
                        
                        // Disperse on hover
                        if (uHover > 0.0) {
                             pos.x += snoise(vec3(pos.x, uTime, 0.0)) * 10.0 * uHover;
                             pos.y += snoise(vec3(pos.y, uTime, 1.0)) * 10.0 * uHover;
                             pos.z += snoise(vec3(pos.z, uTime, 2.0)) * 20.0 * uHover;
                        }

                        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                        gl_PointSize = size * (300.0 / -mvPosition.z);
                        gl_Position = projectionMatrix * mvPosition;
                        
                        // Color mix based on hover/movement
                        float mixVal = smoothstep(-10.0, 10.0, pos.z);
                        // Hardcoded purple to pink
                        vColor = mix(vec3(0.66, 0.33, 0.97), vec3(0.93, 0.28, 0.6), uHover * mixVal);
                    }
                `,
                fragmentShader: `
                    varying vec3 vColor;
                    
                    void main() {
                        // Circular particles
                        if (length(gl_PointCoord - vec2(0.5)) > 0.5) discard;
                        gl_FragColor = vec4(vColor, 1.0);
                    }
                `,
                transparent: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending
            });

            particles = new THREE.Points(geometry, material);
            scene.add(particles);
        }

        // Animation Loop
        function animate() {
            requestAnimationFrame(animate);
            time += 0.01;

            if (particles) {
                particles.material.uniforms.uTime.value = time;

                // Smoothly interpolate hover value
                const targetHover = isHovering ? 1.0 : 0.0;
                particles.material.uniforms.uHover.value += (targetHover - particles.material.uniforms.uHover.value) * 0.1;

                // Continuous subtle rotation
                particles.rotation.y = Math.sin(time * 0.2) * 0.1;
            }

            renderer.render(scene, camera);
        }

        // Events
        wrapper.addEventListener('mouseenter', () => isHovering = true);
        wrapper.addEventListener('mouseleave', () => isHovering = false);
        wrapper.addEventListener('mousemove', (e) => {
            if (!particles) return;
            // Map mouse to 3D space rough approximation
            const rect = wrapper.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

            // Should properly unproject but for simple effect this works
            particles.material.uniforms.uMouse.value.set(x * 30, y * 30, 0);
        });

        console.log('✨ Particle Logo initialized');
    }
})();
