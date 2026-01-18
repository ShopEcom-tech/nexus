/**
 * Confetti Animation
 * Innovation #27: Celebration effect on form submissions
 */

(function () {
    'use strict';

    const CONFETTI_CONFIG = {
        particleCount: 100,
        spread: 70,
        colors: ['#7c3aed', '#db2777', '#4ade80', '#fbbf24', '#60a5fa']
    };

    function injectStyles() {
        const styles = `
            .confetti-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 2000;
                overflow: hidden;
            }

            .confetti {
                position: absolute;
                width: 10px;
                height: 10px;
                opacity: 0;
            }

            @keyframes confetti-fall {
                0% {
                    opacity: 1;
                    transform: translateY(0) rotate(0deg);
                }
                100% {
                    opacity: 0;
                    transform: translateY(100vh) rotate(720deg);
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    function createConfettiParticle(container, originX, originY) {
        const particle = document.createElement('div');
        particle.className = 'confetti';

        const color = CONFETTI_CONFIG.colors[Math.floor(Math.random() * CONFETTI_CONFIG.colors.length)];
        const size = Math.random() * 10 + 5;
        const shape = Math.random() > 0.5 ? '50%' : '0';

        const spreadX = (Math.random() - 0.5) * CONFETTI_CONFIG.spread * 10;
        const duration = Math.random() * 2 + 2;
        const delay = Math.random() * 0.5;

        particle.style.cssText = `
            left: ${originX + spreadX}px;
            top: ${originY - 50}px;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: ${shape};
            animation: confetti-fall ${duration}s ease-out ${delay}s forwards;
        `;

        container.appendChild(particle);

        setTimeout(() => particle.remove(), (duration + delay) * 1000);
    }

    window.triggerConfetti = function (originX, originY) {
        let container = document.querySelector('.confetti-container');

        if (!container) {
            container = document.createElement('div');
            container.className = 'confetti-container';
            document.body.appendChild(container);
        }

        // Default to center of screen
        originX = originX || window.innerWidth / 2;
        originY = originY || window.innerHeight / 2;

        for (let i = 0; i < CONFETTI_CONFIG.particleCount; i++) {
            createConfettiParticle(container, originX, originY);
        }
    };

    // Auto-trigger on form success
    function observeForms() {
        document.addEventListener('submit', (e) => {
            const form = e.target;
            // Trigger confetti after a delay (assuming form success)
            setTimeout(() => {
                const rect = form.getBoundingClientRect();
                window.triggerConfetti(rect.left + rect.width / 2, rect.top);
            }, 500);
        });

        // Also observe success messages
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        // Ignore Chatbot Messages
                        if (node.classList.contains('chatbot-message') || node.closest('.chatbot-widget')) {
                            return;
                        }

                        const text = node.textContent.toLowerCase();
                        if (text.includes('merci') || text.includes('succès') || text.includes('envoyé')) {
                            window.triggerConfetti();
                        }
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    function init() {
        injectStyles();
        observeForms();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
