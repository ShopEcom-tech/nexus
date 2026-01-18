/**
 * Visitor Counter
 * Innovation #23: Real-time visitor count for social proof
 */

(function () {
    'use strict';

    const CONFIG = {
        minVisitors: 3,
        maxVisitors: 12,
        updateInterval: 30000, // Update every 30s
        showOnPages: ['index', 'offres']
    };

    function injectStyles() {
        const styles = `
            .visitor-counter {
                position: fixed;
                bottom: 24px;
                left: 24px;
                background: rgba(15, 15, 20, 0.95);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(74, 222, 128, 0.3);
                border-radius: 30px;
                padding: 10px 18px;
                z-index: 9993;
                display: flex;
                align-items: center;
                gap: 10px;
                font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
                animation: slideInLeft 0.5s ease;
            }

            @keyframes slideInLeft {
                from {
                    transform: translateX(-100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            .visitor-dot {
                width: 10px;
                height: 10px;
                background: #4ade80;
                border-radius: 50%;
                animation: pulse-dot 2s ease-in-out infinite;
            }

            @keyframes pulse-dot {
                0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.4); }
                50% { opacity: 0.8; box-shadow: 0 0 0 8px rgba(74, 222, 128, 0); }
            }

            .visitor-count {
                color: #4ade80;
                font-size: 14px;
                font-weight: 700;
            }

            .visitor-text {
                color: #a1a1aa;
                font-size: 13px;
            }

            @media (max-width: 768px) {
                .visitor-counter {
                    display: none;
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    function getRandomVisitorCount() {
        return Math.floor(Math.random() * (CONFIG.maxVisitors - CONFIG.minVisitors + 1)) + CONFIG.minVisitors;
    }

    function createCounter() {
        const counter = document.createElement('div');
        counter.className = 'visitor-counter';
        counter.id = 'visitor-counter';

        const count = getRandomVisitorCount();

        counter.innerHTML = `
            <span class="visitor-dot"></span>
            <span class="visitor-count" id="visitor-count">${count}</span>
            <span class="visitor-text">personnes consultent ce site</span>
        `;

        document.body.appendChild(counter);
    }

    function updateCount() {
        const countEl = document.getElementById('visitor-count');
        if (countEl) {
            countEl.textContent = getRandomVisitorCount();
        }
    }

    function shouldShowOnCurrentPage() {
        const path = window.location.pathname.toLowerCase();
        return CONFIG.showOnPages.some(page =>
            path.includes(page) || path === '/' || path.endsWith('/index.html')
        );
    }

    function init() {
        if (!shouldShowOnCurrentPage()) return;

        injectStyles();
        createCounter();

        // Update periodically
        setInterval(updateCount, CONFIG.updateInterval);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
