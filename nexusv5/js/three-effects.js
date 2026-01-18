/* ========================================
   NEXUS - THREE.JS 3D EFFECTS V2 (WASM POWERED)
   Premium Interactive Background - ENHANCED WITH RUST
   ======================================== */

import * as THREE from 'three';
import WasmParticleSystem from './wasm-particles.js';

async function initThreeJS() {
    const container = document.getElementById('three-container');
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();

    // Add subtle fog for depth
    scene.fog = new THREE.FogExp2(0x0a0a0f, 0.008);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    // Renderer with enhanced settings
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Mouse tracking
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    document.addEventListener('mousemove', (e) => {
        mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // ========================================
    // ENHANCED COLOR PALETTE - CYBERPUNK
    // ========================================
    const colorPalette = [
        new THREE.Color(0x7c3aed), // Purple
        new THREE.Color(0xdb2777), // Pink
        new THREE.Color(0x06b6d4), // Cyan
        new THREE.Color(0x8b5cf6), // Violet
        new THREE.Color(0xec4899), // Hot pink
        new THREE.Color(0x3b82f6), // Blue
        new THREE.Color(0xa855f7), // Light purple
    ];

    // ========================================
    // WASM PARTICLE SYSTEM (10,000 particles)
    // ========================================
    // Replaces the old JS-based 2000 particle system
    const wasmSystem = new WasmParticleSystem(scene, 10000);

    // ========================================
    // ENHANCED GEOMETRIC SHAPES
    // ========================================
    const shapes = [];

    // Create various shapes
    const createShape = (geometry, position, scale, colorIndex) => {
        const material = new THREE.MeshBasicMaterial({
            color: colorPalette[colorIndex % colorPalette.length],
            wireframe: true,
            transparent: true,
            opacity: 0.25
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(position);
        mesh.scale.setScalar(scale);
        mesh.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );

        return mesh;
    };

    // Add various shapes
    const shapeConfigs = [
        // Torus rings
        { geo: new THREE.TorusGeometry(3, 0.5, 16, 32), pos: new THREE.Vector3(-40, 20, -30), scale: 1.5 },
        { geo: new THREE.TorusGeometry(4, 0.3, 16, 32), pos: new THREE.Vector3(35, -15, -25), scale: 1.2 },
        { geo: new THREE.TorusGeometry(2.5, 0.4, 16, 32), pos: new THREE.Vector3(0, 30, -40), scale: 1.8 },

        // Icosahedrons (crystal-like)
        { geo: new THREE.IcosahedronGeometry(3, 0), pos: new THREE.Vector3(-30, -25, -20), scale: 1.0 },
        { geo: new THREE.IcosahedronGeometry(2.5, 1), pos: new THREE.Vector3(40, 25, -35), scale: 1.3 },

        // Octahedrons (diamond-like)
        { geo: new THREE.OctahedronGeometry(2.5, 0), pos: new THREE.Vector3(25, -30, -25), scale: 1.2 },
        { geo: new THREE.OctahedronGeometry(3, 0), pos: new THREE.Vector3(-35, 10, -30), scale: 1.0 },

        // Dodecahedrons
        { geo: new THREE.DodecahedronGeometry(2, 0), pos: new THREE.Vector3(15, 35, -35), scale: 1.4 },
        { geo: new THREE.DodecahedronGeometry(2.5, 0), pos: new THREE.Vector3(-20, -35, -25), scale: 1.1 },

        // Tetrahedrons
        { geo: new THREE.TetrahedronGeometry(2, 0), pos: new THREE.Vector3(45, 0, -30), scale: 1.5 },
        { geo: new THREE.TetrahedronGeometry(2.5, 0), pos: new THREE.Vector3(-45, -20, -35), scale: 1.2 },

        // Torus Knots (fancy)
        { geo: new THREE.TorusKnotGeometry(2, 0.5, 64, 8, 2, 3), pos: new THREE.Vector3(0, -40, -40), scale: 0.8 },
        { geo: new THREE.TorusKnotGeometry(1.5, 0.4, 64, 8, 3, 2), pos: new THREE.Vector3(-25, 40, -45), scale: 1.0 },
    ];

    shapeConfigs.forEach((config, i) => {
        const mesh = createShape(config.geo, config.pos, config.scale, i);
        shapes.push({
            mesh,
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.008,
                y: (Math.random() - 0.5) * 0.01,
                z: (Math.random() - 0.5) * 0.005
            },
            floatSpeed: Math.random() * 0.3 + 0.2,
            floatOffset: Math.random() * Math.PI * 2,
            floatAmplitude: Math.random() * 0.5 + 0.3
        });
        scene.add(mesh);
    });

    // ========================================
    // ENHANCED CONNECTION LINES
    // ========================================
    // Note: JS connection lines kept for background structure
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(200 * 6);
    const lineColors = new Float32Array(200 * 6);
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending
    });

    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    // ========================================
    // FLOATING RING EFFECT
    // ========================================
    const ringGeometry = new THREE.RingGeometry(15, 16, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0x7c3aed,
        transparent: true,
        opacity: 0.1,
        side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.position.z = -30;
    ring.rotation.x = Math.PI * 0.3;
    scene.add(ring);

    const ring2 = ring.clone();
    ring2.material = ringMaterial.clone();
    ring2.material.color = new THREE.Color(0xdb2777);
    ring2.scale.setScalar(1.3);
    ring2.position.z = -40;
    ring2.rotation.x = Math.PI * 0.4;
    scene.add(ring2);

    // ========================================
    // ANIMATION LOOP
    // ========================================
    let time = 0;
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const delta = clock.getDelta();
        time += delta;

        // Smooth mouse following
        mouse.x += (mouse.targetX - mouse.x) * 0.08;
        mouse.y += (mouse.targetY - mouse.y) * 0.08;

        // Update WASM Particle System
        wasmSystem.update(delta);

        // Animate shapes
        shapes.forEach((shape) => {
            shape.mesh.rotation.x += shape.rotationSpeed.x;
            shape.mesh.rotation.y += shape.rotationSpeed.y;
            shape.mesh.rotation.z += shape.rotationSpeed.z;

            // Enchanced floating motion
            const floatY = Math.sin(time * shape.floatSpeed + shape.floatOffset) * shape.floatAmplitude;
            const floatX = Math.cos(time * shape.floatSpeed * 0.7 + shape.floatOffset) * shape.floatAmplitude * 0.3;
            shape.mesh.position.y += floatY * 0.02;
            shape.mesh.position.x += floatX * 0.01;
        });

        // Animate rings
        ring.rotation.z += 0.002;
        ring2.rotation.z -= 0.0015;
        ring.material.opacity = 0.08 + Math.sin(time * 0.5) * 0.03;
        ring2.material.opacity = 0.06 + Math.cos(time * 0.4) * 0.02;

        // Camera movement
        camera.position.x += (mouse.x * 8 - camera.position.x) * 0.03;
        camera.position.y += (mouse.y * 8 - camera.position.y) * 0.03;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

    animate();

    // ========================================
    // RESIZE HANDLER
    // ========================================
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // ========================================
    // ENHANCED SCROLL PARALLAX
    // ========================================
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const scrollProgress = Math.min(scrollY / maxScroll, 1);

        // Camera depth on scroll
        camera.position.z = 50 + scrollProgress * 40;

        // Note: Global rotation of particles handled by camera/scene movement now

        // Fade fog based on scroll
        scene.fog.density = 0.008 + scrollProgress * 0.005;
    });

    console.log('🦀 Rust/WASM 3D Effects - Loaded successfully!');
    console.log('🔥 10,000 Particles simulating via WebAssembly');
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThreeJS);
} else {
    initThreeJS();
}
