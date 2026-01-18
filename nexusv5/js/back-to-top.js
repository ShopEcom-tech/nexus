/**
 * Back to Top Button with Progress Ring
 * Innovation #9: Shows scroll progress and smooth scroll back to top
 */

(function () {
    'use strict';

    const CONFIG = {
        showAfter: 300, // Show after scrolling 300px
        smoothScroll: true,
        scrollDuration: 800
    };

    function injectStyles() {
        const styles = `
            .back-to-top {
                position: fixed;
                bottom: 32px;
                right: 100px; /* Between chatbot and edge */
                width: 48px;
                height: 48px;
                z-index: 9996;
                opacity: 0;
                visibility: hidden;
                transform: translateY(20px);
                transition: all 0.3s ease;
            }

            .back-to-top.visible {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }

            .back-to-top-button {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background: rgba(15, 15, 20, 0.9);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                position: relative;
            }

            .back-to-top-button:hover {
                background: rgba(124, 58, 237, 0.2);
                border-color: rgba(124, 58, 237, 0.4);
                transform: scale(1.1);
            }

            .back-to-top-button svg.arrow {
                width: 20px;
                height: 20px;
                stroke: #a1a1aa;
                fill: none;
                stroke-width: 2;
                transition: stroke 0.3s;
            }

            .back-to-top-button:hover svg.arrow {
                stroke: #a78bfa;
            }

            /* Progress ring */
            .back-to-top-progress {
                position: absolute;
                top: -2px;
                left: -2px;
                width: 52px;
                height: 52px;
                transform: rotate(-90deg);
            }

            .back-to-top-progress circle {
                fill: none;
                stroke-width: 2;
            }

            .back-to-top-progress .progress-bg {
                stroke: rgba(255, 255, 255, 0.1);
            }

            .back-to-top-progress .progress-bar {
                stroke: url(#progress-gradient);
                stroke-linecap: round;
                transition: stroke-dashoffset 0.1s ease;
            }

            @media (max-width: 768px) {
                .back-to-top {
                    right: 80px;
                    bottom: 24px;
                    width: 44px;
                    height: 44px;
                }

                .back-to-top-progress {
                    width: 48px;
                    height: 48px;
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    function createButton() {
        const container = document.createElement('div');
        container.className = 'back-to-top';
        container.id = 'back-to-top';

        const circumference = 2 * Math.PI * 23; // radius = 23

        container.innerHTML = `
            <button class="back-to-top-button" onclick="window.scrollToTop()" aria-label="Retour en haut">
                <svg class="back-to-top-progress" viewBox="0 0 52 52">
                    <defs>
                        <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stop-color="#7c3aed"/>
                            <stop offset="100%" stop-color="#db2777"/>
                        </linearGradient>
                    </defs>
                    <circle class="progress-bg" cx="26" cy="26" r="23"/>
                    <circle class="progress-bar" cx="26" cy="26" r="23" 
                        stroke-dasharray="${circumference}" 
                        stroke-dashoffset="${circumference}"/>
                </svg>
                <svg class="arrow" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"/>
                </svg>
            </button>
        `;

        document.body.appendChild(container);
        return container;
    }

    function updateProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = Math.min(scrollTop / docHeight, 1);

        const circumference = 2 * Math.PI * 23;
        const offset = circumference * (1 - progress);

        const progressBar = document.querySelector('.back-to-top-progress .progress-bar');
        if (progressBar) {
            progressBar.style.strokeDashoffset = offset;
        }

        const button = document.getElementById('back-to-top');
        if (button) {
            if (scrollTop > CONFIG.showAfter) {
                button.classList.add('visible');
            } else {
                button.classList.remove('visible');
            }
        }
    }

    window.scrollToTop = function () {
        if (CONFIG.smoothScroll) {
            const start = window.scrollY;
            const startTime = performance.now();

            function animate(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / CONFIG.scrollDuration, 1);

                // Easing function
                const easeProgress = 1 - Math.pow(1 - progress, 3);

                window.scrollTo(0, start * (1 - easeProgress));

                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            }

            requestAnimationFrame(animate);
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    function init() {
        injectStyles();
        createButton();

        // Initial check
        updateProgress();

        // Listen for scroll
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateProgress();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
