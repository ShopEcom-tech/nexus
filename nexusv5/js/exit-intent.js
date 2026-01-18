/**
 * Exit Intent Popup
 * Innovation #16: Captures visitors about to leave with special offer
 */

(function () {
    'use strict';

    const EXIT_CONFIG = {
        enabled: true,
        delay: 5000, // Wait 5s before enabling
        cookieName: 'nexus_exit_shown',
        title: '🎁 Attendez ! Ne partez pas...',
        subtitle: 'Nous avons une offre spéciale pour vous',
        offer: '-15% sur votre premier projet',
        ctaText: 'Obtenir mon code promo',
        ctaLink: 'pages/contact.html',
        promoCode: 'NEXUS15'
    };

    let exitEnabled = false;
    let exitShown = false;

    function injectStyles() {
        const styles = `
            .exit-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(8px);
                z-index: 100000;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }

            .exit-overlay.visible {
                opacity: 1;
                visibility: visible;
            }

            .exit-popup {
                background: linear-gradient(135deg, #0f0f17, #1a1a2e);
                border: 1px solid rgba(124, 58, 237, 0.3);
                border-radius: 24px;
                padding: 48px;
                max-width: 480px;
                width: 90%;
                text-align: center;
                position: relative;
                transform: scale(0.8);
                transition: transform 0.3s ease;
            }

            .exit-overlay.visible .exit-popup {
                transform: scale(1);
            }

            .exit-close {
                position: absolute;
                top: 16px;
                right: 16px;
                background: none;
                border: none;
                color: #71717a;
                font-size: 24px;
                cursor: pointer;
                padding: 4px;
                line-height: 1;
                transition: color 0.2s;
            }

            .exit-close:hover {
                color: white;
            }

            .exit-icon {
                font-size: 64px;
                margin-bottom: 20px;
            }

            .exit-title {
                font-size: 28px;
                font-weight: 800;
                color: white;
                margin-bottom: 8px;
            }

            .exit-subtitle {
                color: #a1a1aa;
                font-size: 16px;
                margin-bottom: 24px;
            }

            .exit-offer {
                background: linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(236, 72, 153, 0.2));
                border: 2px dashed rgba(124, 58, 237, 0.5);
                border-radius: 16px;
                padding: 24px;
                margin-bottom: 24px;
            }

            .exit-offer-text {
                font-size: 32px;
                font-weight: 800;
                background: linear-gradient(135deg, #7c3aed, #db2777);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }

            .exit-code {
                display: inline-block;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 8px;
                padding: 8px 16px;
                margin-top: 12px;
                font-family: monospace;
                font-size: 18px;
                font-weight: 700;
                color: #4ade80;
                letter-spacing: 2px;
            }

            .exit-cta {
                display: inline-block;
                background: linear-gradient(135deg, #7c3aed, #db2777);
                color: white;
                padding: 16px 32px;
                border-radius: 12px;
                font-size: 16px;
                font-weight: 600;
                text-decoration: none;
                transition: all 0.3s;
            }

            .exit-cta:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 30px rgba(124, 58, 237, 0.4);
            }

            .exit-dismiss {
                display: block;
                margin-top: 16px;
                color: #71717a;
                font-size: 13px;
                cursor: pointer;
                background: none;
                border: none;
                font-family: inherit;
            }

            .exit-dismiss:hover {
                color: #a1a1aa;
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    function isShown() {
        return sessionStorage.getItem(EXIT_CONFIG.cookieName) === 'true';
    }

    function setShown() {
        sessionStorage.setItem(EXIT_CONFIG.cookieName, 'true');
    }

    function createPopup() {
        const overlay = document.createElement('div');
        overlay.className = 'exit-overlay';
        overlay.id = 'exit-overlay';

        overlay.innerHTML = `
            <div class="exit-popup">
                <button class="exit-close" onclick="window.closeExitPopup()">×</button>
                <div class="exit-icon">🎁</div>
                <h2 class="exit-title">${EXIT_CONFIG.title}</h2>
                <p class="exit-subtitle">${EXIT_CONFIG.subtitle}</p>
                <div class="exit-offer">
                    <div class="exit-offer-text">${EXIT_CONFIG.offer}</div>
                    <div class="exit-code">${EXIT_CONFIG.promoCode}</div>
                </div>
                <a href="${EXIT_CONFIG.ctaLink}" class="exit-cta">${EXIT_CONFIG.ctaText}</a>
                <button class="exit-dismiss" onclick="window.closeExitPopup()">Non merci, je préfère payer plein tarif</button>
            </div>
        `;

        document.body.appendChild(overlay);

        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) window.closeExitPopup();
        });
    }

    function showPopup() {
        if (exitShown || isShown()) return;

        exitShown = true;
        setShown();

        const overlay = document.getElementById('exit-overlay');
        if (overlay) {
            overlay.classList.add('visible');
        }
    }

    window.closeExitPopup = function () {
        const overlay = document.getElementById('exit-overlay');
        if (overlay) {
            overlay.classList.remove('visible');
        }
    };

    function handleMouseLeave(e) {
        if (!exitEnabled) return;
        if (e.clientY <= 0) {
            showPopup();
        }
    }

    function init() {
        if (!EXIT_CONFIG.enabled) return;
        if (isShown()) return;

        injectStyles();
        createPopup();

        // Enable after delay
        setTimeout(() => {
            exitEnabled = true;
        }, EXIT_CONFIG.delay);

        // Listen for exit intent
        document.addEventListener('mouseleave', handleMouseLeave);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
