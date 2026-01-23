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
            density: 2, // Particles per pixel
            particleSize: 1.5,
            color: 0x2563eb,      // Royal Blue (#2563eb)
            hoverColor: 0x0ea5e9, // Sky Blue (#0ea5e9)
            dispersion: 0.8
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

        // Hide original image but keep it
        logoImg.style.display = 'none';
        logoImg.parentNode.insertBefore(wrapper, logoImg);
        wrapper.appendChild(logoImg);
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

        // Load Texture
        const loader = new THREE.TextureLoader();
        loader.load(
            logoImg.src,
            (texture) => {
                try {
                    createParticles(texture);
                    animate();
                } catch (e) {
                    console.error('Error causing fallback:', e);
                    revertToImage();
                }
            },
            undefined,
            (err) => {
                console.error('Error loading texture:', err);
                revertToImage();
            }
        );

        function revertToImage() {
            if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
            logoImg.style.display = 'block';
            logoImg.style.width = '40px';
            logoImg.style.height = '40px';
            if (wrapper.parentNode) {
                wrapper.parentNode.insertBefore(logoImg, wrapper);
                wrapper.parentNode.removeChild(wrapper);
            }
        }

        function createParticles(texture) {
            const imgParams = { width: 100, height: 100 };
            const tmpCanvas = document.createElement('canvas');
            tmpCanvas.width = imgParams.width;
            tmpCanvas.height = imgParams.height;
            const ctx = tmpCanvas.getContext('2d');
            ctx.drawImage(texture.image, 0, 0, imgParams.width, imgParams.height);

            const imgData = ctx.getImageData(0, 0, imgParams.width, imgParams.height).data;
            const positions = [];
            const origins = [];
            const colors = [];
            const sizes = [];

            const offsetX = -imgParams.width / 2;
            const offsetY = -imgParams.height / 2;
            let visiblePixels = 0;

            for (let y = 0; y < imgParams.height; y++) {
                for (let x = 0; x < imgParams.width; x++) {
                    const i = (y * imgParams.width + x) * 4;
                    const alpha = imgData[i + 3];

                    if (alpha > 128) {
                        visiblePixels++;
                        const pX = (x + offsetX) * 0.8;
                        const pY = -(y + offsetY) * 0.8;

                        positions.push(pX, pY, 0);
                        origins.push(pX, pY, 0);

                        // Blue color logic
                        colors.push(0.14, 0.39, 0.92); // Royal Blue
                        sizes.push(Math.random() * config.particleSize);
                    }
                }
            }

            if (visiblePixels < 10) throw new Error('Texture empty');

            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            geometry.setAttribute('origin', new THREE.Float32BufferAttribute(origins, 3));
            geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
            geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

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
                    
                    // Simplex noise (simplified for brevity but functional)
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
                        vec3 x2 = x0 - i2 + C.yyy;
                        vec3 x3 = x0 - D.yyy;
                        i = mod289(i); 
                        vec4 p = permute( permute( permute( 
                                    i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                                + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
                                + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
                        float n_ = 0.142857142857;
                        vec3  ns = n_ * D.wyz - D.xzx;
                        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
                        vec4 x_ = floor(j * ns.z);
                        vec4 y_ = floor(j - 7.0 * x_ );
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
                        float noiseVal = snoise(vec3(pos.x * 0.05, pos.y * 0.05, uTime * 0.5));
                        float dist = distance(pos.xy, uMouse.xy);
                        pos += normal * noiseVal * (0.5 + uHover * 5.0);
                        
                        if (uHover > 0.0) {
                             pos.x += snoise(vec3(pos.x, uTime, 0.0)) * 10.0 * uHover;
                             pos.y += snoise(vec3(pos.y, uTime, 1.0)) * 10.0 * uHover;
                             pos.z += snoise(vec3(pos.z, uTime, 2.0)) * 20.0 * uHover;
                        }

                        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                        gl_PointSize = size * (300.0 / -mvPosition.z);
                        gl_Position = projectionMatrix * mvPosition;
                        
                        float mixVal = smoothstep(-10.0, 10.0, pos.z);
                        // Mix Blue (0.14, 0.39, 0.92) to Cyan/Sky (0.05, 0.65, 0.91)
                        vColor = mix(vec3(0.14, 0.39, 0.92), vec3(0.05, 0.65, 0.91), uHover * mixVal);
                    }
                `,
                fragmentShader: `
                    varying vec3 vColor;
                    void main() {
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

        function animate() {
            requestAnimationFrame(animate);
            time += 0.01;

            if (particles) {
                particles.material.uniforms.uTime.value = time;
                const targetHover = isHovering ? 1.0 : 0.0;
                particles.material.uniforms.uHover.value += (targetHover - particles.material.uniforms.uHover.value) * 0.1;
                particles.rotation.y = Math.sin(time * 0.2) * 0.1;
            }
            renderer.render(scene, camera);
        }

        wrapper.addEventListener('mouseenter', () => isHovering = true);
        wrapper.addEventListener('mouseleave', () => isHovering = false);
        wrapper.addEventListener('mousemove', (e) => {
            if (!particles) return;
            const rect = wrapper.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            particles.material.uniforms.uMouse.value.set(x * 30, y * 30, 0);
        });

        console.log('✨ Particle Logo initialized');
    }
})();
