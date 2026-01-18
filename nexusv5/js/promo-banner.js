/**
 * Promo Banner Widget
 * Innovation #15: Elegant promotional banner integrated with navbar
 */

(function () {
    'use strict';

    const PROMO_CONFIG = {
        enabled: false,
        message: '🎉 Offre limitée : -20% sur tous nos sites jusqu\'au 31 janvier !',
        link: '/pages/offres.html',
        linkText: 'En profiter →',
        dismissible: true,
        cookieName: 'nexus_promo_dismissed',
        expiryDays: 7
    };

    function injectStyles() {
        const styles = `
            .promo-banner {
                position: fixed;
                top: 10px;
                left: 50%;
                transform: translateX(-50%) translateY(-100px);
                background: rgba(15, 15, 20, 0.85);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(124, 58, 237, 0.3);
                z-index: 10000;
                padding: 10px 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 14px;
                font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
                border-radius: 50px;
                transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                box-shadow: 0 4px 30px rgba(124, 58, 237, 0.15);
            }

            .promo-banner.visible {
                transform: translateX(-50%) translateY(0);
            }

            .promo-banner::before {
                content: '';
                position: absolute;
                inset: 0;
                border-radius: 50px;
                padding: 1px;
                background: linear-gradient(90deg, #7c3aed, #db2777, #7c3aed);
                -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                -webkit-mask-composite: xor;
                mask-composite: exclude;
                opacity: 0.5;
            }

            .promo-banner-emoji {
                font-size: 16px;
            }

            .promo-banner-text {
                color: #e4e4e7;
                font-size: 13px;
                font-weight: 500;
            }

            .promo-banner-text strong {
                color: white;
                background: linear-gradient(90deg, #a78bfa, #f472b6);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }

            .promo-banner-link {
                background: linear-gradient(135deg, #7c3aed, #db2777);
                color: white;
                padding: 6px 14px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
                text-decoration: none;
                transition: all 0.2s;
                white-space: nowrap;
            }

            .promo-banner-link:hover {
                transform: scale(1.05);
                box-shadow: 0 4px 15px rgba(124, 58, 237, 0.4);
            }

            .promo-banner-close {
                background: none;
                border: none;
                color: #71717a;
                font-size: 16px;
                cursor: pointer;
                padding: 2px 6px;
                line-height: 1;
                transition: color 0.2s;
                margin-left: 4px;
            }

            .promo-banner-close:hover {
                color: white;
            }

            @media (max-width: 768px) {
                .promo-banner {
                    left: 16px;
                    right: 16px;
                    transform: translateX(0) translateY(-100px);
                    padding: 10px 16px;
                    gap: 10px;
                }

                .promo-banner.visible {
                    transform: translateX(0) translateY(0);
                }

                .promo-banner-text {
                    font-size: 12px;
                }

                .promo-banner-link {
                    display: none;
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    function isDismissed() {
        return localStorage.getItem(PROMO_CONFIG.cookieName) === 'true';
    }

    function setDismissed() {
        localStorage.setItem(PROMO_CONFIG.cookieName, 'true');
    }

    function createBanner() {
        const banner = document.createElement('div');
        banner.className = 'promo-banner';
        banner.id = 'promo-banner';

        banner.innerHTML = `
            <span class="promo-banner-text"><strong>-20%</strong> sur tous nos sites jusqu'au 31 janvier</span>
            <a href="${PROMO_CONFIG.link}" class="promo-banner-link">${PROMO_CONFIG.linkText}</a>
            ${PROMO_CONFIG.dismissible ? '<button class="promo-banner-close" onclick="window.dismissPromoBanner()">×</button>' : ''}
        `;

        document.body.appendChild(banner);

        // Show after a small delay
        setTimeout(() => {
            banner.classList.add('visible');
        }, 800);
    }

    window.dismissPromoBanner = function () {
        const banner = document.getElementById('promo-banner');
        if (banner) {
            banner.style.transform = 'translateX(-50%) translateY(-100px)';
            banner.style.opacity = '0';
            setDismissed();

            setTimeout(() => banner.remove(), 500);
        }
    };

    function init() {
        if (!PROMO_CONFIG.enabled) return;
        if (isDismissed()) return;

        injectStyles();
        createBanner();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
