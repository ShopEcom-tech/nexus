/**
 * Trust Badges Widget
 * Innovation #12: Floating trust indicators for credibility
 */

(function () {
    'use strict';

    const TRUST_DATA = {
        badges: [
            { icon: '🔒', text: 'Paiement 100% sécurisé', color: '#4ade80' },
            { icon: '✅', text: 'Satisfaction garantie', color: '#a78bfa' },
            { icon: '🛡️', text: 'Support réactif', color: '#60a5fa' },
            { icon: '🚀', text: '150+ projets livrés', color: '#f472b6' }
        ],
        showOnPages: ['offres', 'services', 'contact'],
        scrollThreshold: 400
    };

    function injectStyles() {
        const styles = `
            .trust-badges {
                position: fixed;
                top: 50%;
                right: 16px;
                transform: translateY(-50%);
                z-index: 9990;
                display: flex;
                flex-direction: column;
                gap: 8px;
                opacity: 0;
                visibility: hidden;
                transition: all 0.4s ease;
            }

            .trust-badges.visible {
                opacity: 1;
                visibility: visible;
            }

            .trust-badge {
                display: flex;
                align-items: center;
                gap: 8px;
                background: rgba(15, 15, 20, 0.9);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 30px;
                padding: 8px 14px;
                transition: all 0.3s ease;
                cursor: default;
                transform: translateX(80px);
            }

            .trust-badges.visible .trust-badge {
                transform: translateX(0);
            }

            .trust-badge:nth-child(1) { transition-delay: 0.1s; }
            .trust-badge:nth-child(2) { transition-delay: 0.2s; }
            .trust-badge:nth-child(3) { transition-delay: 0.3s; }
            .trust-badge:nth-child(4) { transition-delay: 0.4s; }

            .trust-badge:hover {
                transform: translateX(-10px);
                border-color: rgba(255, 255, 255, 0.2);
            }

            .trust-badge-icon {
                font-size: 16px;
                flex-shrink: 0;
            }

            .trust-badge-text {
                font-size: 11px;
                font-weight: 600;
                color: white;
                white-space: nowrap;
                max-width: 0;
                overflow: hidden;
                transition: max-width 0.3s ease;
            }

            .trust-badge:hover .trust-badge-text {
                max-width: 150px;
            }

            @media (max-width: 768px) {
                .trust-badges {
                    display: none;
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    function createBadges() {
        const container = document.createElement('div');
        container.className = 'trust-badges';
        container.id = 'trust-badges';

        container.innerHTML = TRUST_DATA.badges.map(badge => `
            <div class="trust-badge">
                <span class="trust-badge-icon">${badge.icon}</span>
                <span class="trust-badge-text" style="color: ${badge.color}">${badge.text}</span>
            </div>
        `).join('');

        document.body.appendChild(container);
        return container;
    }

    function shouldShow() {
        const path = window.location.pathname.toLowerCase();
        return TRUST_DATA.showOnPages.some(page => path.includes(page));
    }

    function handleScroll() {
        const badges = document.getElementById('trust-badges');
        if (!badges) return;

        if (window.scrollY > TRUST_DATA.scrollThreshold) {
            badges.classList.add('visible');
        } else {
            badges.classList.remove('visible');
        }
    }

    function init() {
        if (!shouldShow()) return;

        injectStyles();
        createBadges();

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
