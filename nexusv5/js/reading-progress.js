/**
 * Reading Progress Indicator
 * Innovation #24: Shows how much of the page has been read
 */

(function () {
    'use strict';

    const CONFIG = {
        showLabel: true,
        position: 'top-right' // 'top-left', 'top-right'
    };

    function injectStyles() {
        const styles = `
            .reading-progress {
                position: fixed;
                top: 80px;
                right: 24px;
                z-index: 9992;
                display: flex;
                align-items: center;
                gap: 12px;
                background: rgba(15, 15, 20, 0.9);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 30px;
                padding: 8px 16px;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px);
                transition: all 0.3s ease;
            }

            .reading-progress.visible {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }

            .reading-progress-circle {
                width: 36px;
                height: 36px;
                position: relative;
            }

            .reading-progress-circle svg {
                width: 100%;
                height: 100%;
                transform: rotate(-90deg);
            }

            .reading-progress-bg {
                fill: none;
                stroke: rgba(255, 255, 255, 0.1);
                stroke-width: 3;
            }

            .reading-progress-bar {
                fill: none;
                stroke: url(#reading-gradient);
                stroke-width: 3;
                stroke-linecap: round;
                transition: stroke-dashoffset 0.1s ease;
            }

            .reading-progress-text {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 10px;
                font-weight: 700;
                color: white;
            }

            .reading-progress-label {
                color: #a1a1aa;
                font-size: 12px;
            }

            @media (max-width: 768px) {
                .reading-progress {
                    display: none;
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    function createIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'reading-progress';
        indicator.id = 'reading-progress';

        const circumference = 2 * Math.PI * 14; // radius = 14

        indicator.innerHTML = `
            <div class="reading-progress-circle">
                <svg viewBox="0 0 36 36">
                    <defs>
                        <linearGradient id="reading-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stop-color="#7c3aed"/>
                            <stop offset="100%" stop-color="#db2777"/>
                        </linearGradient>
                    </defs>
                    <circle class="reading-progress-bg" cx="18" cy="18" r="14"/>
                    <circle class="reading-progress-bar" cx="18" cy="18" r="14" 
                        stroke-dasharray="${circumference}" 
                        stroke-dashoffset="${circumference}"/>
                </svg>
                <span class="reading-progress-text" id="reading-percent">0%</span>
            </div>
            ${CONFIG.showLabel ? '<span class="reading-progress-label">de la page lu</span>' : ''}
        `;

        document.body.appendChild(indicator);
    }

    function updateProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = Math.min(Math.round((scrollTop / docHeight) * 100), 100);

        const circumference = 2 * Math.PI * 14;
        const offset = circumference * (1 - progress / 100);

        const progressBar = document.querySelector('.reading-progress-bar');
        const percentText = document.getElementById('reading-percent');
        const indicator = document.getElementById('reading-progress');

        if (progressBar) {
            progressBar.style.strokeDashoffset = offset;
        }

        if (percentText) {
            percentText.textContent = progress + '%';
        }

        // Show/hide based on scroll position
        if (indicator) {
            if (scrollTop > 200 && progress < 100) {
                indicator.classList.add('visible');
            } else {
                indicator.classList.remove('visible');
            }
        }
    }

    function init() {
        injectStyles();
        createIndicator();

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

        updateProgress();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
