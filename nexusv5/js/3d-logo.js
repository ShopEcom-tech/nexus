/* ========================================
   3D ANIMATED LOGO
   Premium floating logo with Three.js
   ======================================== */

(function () {
    'use strict';

    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init3DLogo);
    } else {
        init3DLogo();
    }

    function init3DLogo() {
        // Find logo container
        const logoLink = document.querySelector('.navbar-logo');
        if (!logoLink || typeof THREE === 'undefined') return;

        const logoImg = logoLink.querySelector('img');
        if (!logoImg) return;

        // Create a wrapper for the 3D effect
        const wrapper = document.createElement('div');
        wrapper.style.cssText = `
            position: relative;
            width: 40px;
            height: 40px;
            display: inline-block;
        `;

        // Create canvas for 3D effect overlay
        const canvas = document.createElement('canvas');
        canvas.width = 40;
        canvas.height = 40;
        canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            border-radius: 12px;
            pointer-events: none;
            mix-blend-mode: screen;
        `;

        // Replace img parent with wrapper
        logoImg.parentNode.insertBefore(wrapper, logoImg);
        wrapper.appendChild(logoImg);
        wrapper.appendChild(canvas);

        logoImg.style.width = '40px';
        logoImg.style.height = '40px';
        logoImg.style.objectFit = 'contain';

        // Setup Three.js
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
        camera.position.z = 3;

        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true
        });
        renderer.setSize(40, 40);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Create 3D geometric shape
        const geometry = new THREE.IcosahedronGeometry(0.8, 0);

        const material = new THREE.MeshBasicMaterial({
            color: 0xa855f7,
            wireframe: true,
            transparent: true,
            opacity: 0.6
        });

        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // Animation
        let time = 0;
        let isHovering = false;

        function animate() {
            requestAnimationFrame(animate);
            time += 0.016;

            const speed = isHovering ? 2 : 1;
            mesh.rotation.x = time * 0.5 * speed;
            mesh.rotation.y = time * 0.7 * speed;

            // Pulse effect
            const scaleFactor = isHovering ? 1.2 : 1;
            const pulse = scaleFactor + Math.sin(time * 2) * 0.08;
            mesh.scale.setScalar(pulse);

            // Color shift on hover
            if (isHovering) {
                material.color.setHex(0xec4899);
            } else {
                material.color.setHex(0xa855f7);
            }

            renderer.render(scene, camera);
        }

        animate();

        // Hover effects
        wrapper.addEventListener('mouseenter', () => {
            isHovering = true;
        });

        wrapper.addEventListener('mouseleave', () => {
            isHovering = false;
        });

        console.log('🎨 3D Logo initialized');
    }
})();
