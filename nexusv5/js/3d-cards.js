/* ========================================
   3D CARDS HOVER EFFECT
   Premium smooth tilt effect for cards
   ======================================== */

(function () {
    'use strict';

    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init3DCards);
    } else {
        init3DCards();
    }

    function init3DCards() {
        // Select all cards that should have 3D effect
        const cards = document.querySelectorAll('.pricing-card, .offer-card');

        if (cards.length === 0) return;

        cards.forEach(card => {
            // Add 3D class for styling
            card.classList.add('has-3d-effect');

            // State tracking
            let currentX = 0;
            let currentY = 0;
            let targetX = 0;
            let targetY = 0;
            let isHovering = false;
            let animationFrame = null;

            // Smooth animation function
            function animate() {
                if (!isHovering) {
                    // Return to center smoothly
                    currentX += (0 - currentX) * 0.1;
                    currentY += (0 - currentY) * 0.1;
                } else {
                    // Smooth interpolation to target
                    currentX += (targetX - currentX) * 0.08;
                    currentY += (targetY - currentY) * 0.08;
                }

                // Apply transform only if significant change
                const rotateX = currentY * 8; // Reduced from 15 to 8 degrees max
                const rotateY = currentX * 8;

                card.style.transform = `
                    perspective(1000px)
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                    scale3d(${isHovering ? 1.02 : 1}, ${isHovering ? 1.02 : 1}, 1)
                `;

                // Continue animation if still moving
                if (Math.abs(currentX) > 0.001 || Math.abs(currentY) > 0.001 || isHovering) {
                    animationFrame = requestAnimationFrame(animate);
                } else {
                    card.style.transform = '';
                }
            }

            // Mouse move handler
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                // Normalize to -1 to 1
                targetX = (x - centerX) / centerX;
                targetY = (y - centerY) / centerY;
            });

            // Mouse enter handler
            card.addEventListener('mouseenter', () => {
                isHovering = true;
                if (!animationFrame) {
                    animate();
                }
            });

            // Mouse leave handler
            card.addEventListener('mouseleave', () => {
                isHovering = false;
                targetX = 0;
                targetY = 0;
                // Continue animation to reset position smoothly
                if (!animationFrame) {
                    animate();
                }
            });
        });

        console.log(`✨ 3D Cards Effect initialized on ${cards.length} cards`);
    }
})();
