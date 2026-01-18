/**
 * Cookie Consent Banner
 * Innovation #10: GDPR-compliant cookie consent with preferences
 */

(function () {
    'use strict';

    const COOKIE_CONFIG = {
        cookieName: 'nexus_cookie_consent',
        cookieExpiry: 365, // Days
        version: 1 // Increment to force re-consent
    };

    function injectStyles() {
        const styles = `
            .cookie-banner {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: rgba(15, 15, 20, 0.98);
                backdrop-filter: blur(20px);
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                padding: 20px;
                z-index: 10001;
                transform: translateY(100%);
                transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
            }

            .cookie-banner.visible {
                transform: translateY(0);
            }

            .cookie-container {
                max-width: 1200px;
                margin: 0 auto;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 24px;
                flex-wrap: wrap;
            }

            .cookie-content {
                flex: 1;
                min-width: 300px;
            }

            .cookie-title {
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 16px;
                font-weight: 600;
                color: white;
                margin-bottom: 8px;
            }

            .cookie-title span {
                font-size: 24px;
            }

            .cookie-text {
                color: #a1a1aa;
                font-size: 14px;
                line-height: 1.6;
            }

            .cookie-text a {
                color: #a78bfa;
                text-decoration: underline;
            }

            .cookie-actions {
                display: flex;
                gap: 12px;
                flex-wrap: wrap;
            }

            .cookie-btn {
                padding: 12px 24px;
                border-radius: 10px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
                border: none;
            }

            .cookie-btn-accept {
                background: linear-gradient(135deg, #7c3aed, #db2777);
                color: white;
            }

            .cookie-btn-accept:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(124, 58, 237, 0.3);
            }

            .cookie-btn-customize {
                background: rgba(255, 255, 255, 0.1);
                color: white;
                border: 1px solid rgba(255, 255, 255, 0.2);
            }

            .cookie-btn-customize:hover {
                background: rgba(255, 255, 255, 0.15);
            }

            .cookie-btn-reject {
                background: transparent;
                color: #71717a;
                padding: 12px 16px;
            }

            .cookie-btn-reject:hover {
                color: #a1a1aa;
            }

            /* Preferences Modal */
            .cookie-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(8px);
                z-index: 10002;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s;
            }

            .cookie-modal.visible {
                opacity: 1;
                visibility: visible;
            }

            .cookie-modal-content {
                background: rgba(15, 15, 20, 0.98);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 20px;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                padding: 32px;
            }

            .cookie-modal-title {
                font-size: 20px;
                font-weight: 700;
                color: white;
                margin-bottom: 20px;
            }

            .cookie-option {
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                padding: 16px;
                margin-bottom: 12px;
            }

            .cookie-option-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 8px;
            }

            .cookie-option-name {
                font-size: 15px;
                font-weight: 600;
                color: white;
            }

            .cookie-option-desc {
                font-size: 13px;
                color: #71717a;
                line-height: 1.5;
            }

            /* Toggle Switch */
            .cookie-toggle {
                position: relative;
                width: 44px;
                height: 24px;
            }

            .cookie-toggle input {
                opacity: 0;
                width: 0;
                height: 0;
            }

            .cookie-toggle-slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 24px;
                transition: 0.3s;
            }

            .cookie-toggle-slider:before {
                position: absolute;
                content: "";
                height: 18px;
                width: 18px;
                left: 3px;
                bottom: 3px;
                background: white;
                border-radius: 50%;
                transition: 0.3s;
            }

            .cookie-toggle input:checked + .cookie-toggle-slider {
                background: linear-gradient(135deg, #7c3aed, #db2777);
            }

            .cookie-toggle input:checked + .cookie-toggle-slider:before {
                transform: translateX(20px);
            }

            .cookie-toggle input:disabled + .cookie-toggle-slider {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .cookie-modal-actions {
                display: flex;
                gap: 12px;
                margin-top: 24px;
            }

            .cookie-modal-actions .cookie-btn {
                flex: 1;
            }

            @media (max-width: 600px) {
                .cookie-container {
                    flex-direction: column;
                    text-align: center;
                }

                .cookie-actions {
                    width: 100%;
                    justify-content: center;
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    function getCookie() {
        const value = localStorage.getItem(COOKIE_CONFIG.cookieName);
        if (!value) return null;
        try {
            const data = JSON.parse(value);
            if (data.version !== COOKIE_CONFIG.version) return null;
            return data;
        } catch {
            return null;
        }
    }

    function setCookie(preferences) {
        const data = {
            ...preferences,
            version: COOKIE_CONFIG.version,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem(COOKIE_CONFIG.cookieName, JSON.stringify(data));
    }

    function createBanner() {
        const banner = document.createElement('div');
        banner.className = 'cookie-banner';
        banner.id = 'cookie-banner';

        banner.innerHTML = `
            <div class="cookie-container">
                <div class="cookie-content">
                    <div class="cookie-title">
                        <span>🍪</span> Nous respectons votre vie privée
                    </div>
                    <p class="cookie-text">
                        Nous utilisons des cookies pour améliorer votre expérience de navigation et analyser notre trafic.
                        <a href="pages/confidentialite.html">En savoir plus</a>
                    </p>
                </div>
                <div class="cookie-actions">
                    <button class="cookie-btn cookie-btn-accept" onclick="window.acceptAllCookies()">
                        Accepter tout
                    </button>
                    <button class="cookie-btn cookie-btn-customize" onclick="window.showCookiePreferences()">
                        Personnaliser
                    </button>
                    <button class="cookie-btn cookie-btn-reject" onclick="window.rejectAllCookies()">
                        Refuser
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(banner);

        // Show after a small delay
        setTimeout(() => banner.classList.add('visible'), 500);
    }

    function createModal() {
        const modal = document.createElement('div');
        modal.className = 'cookie-modal';
        modal.id = 'cookie-modal';

        modal.innerHTML = `
            <div class="cookie-modal-content">
                <div class="cookie-modal-title">Paramètres des cookies</div>
                
                <div class="cookie-option">
                    <div class="cookie-option-header">
                        <span class="cookie-option-name">🔒 Cookies essentiels</span>
                        <label class="cookie-toggle">
                            <input type="checkbox" checked disabled>
                            <span class="cookie-toggle-slider"></span>
                        </label>
                    </div>
                    <p class="cookie-option-desc">Nécessaires au fonctionnement du site. Ne peuvent pas être désactivés.</p>
                </div>

                <div class="cookie-option">
                    <div class="cookie-option-header">
                        <span class="cookie-option-name">📊 Cookies analytiques</span>
                        <label class="cookie-toggle">
                            <input type="checkbox" id="cookie-analytics" checked>
                            <span class="cookie-toggle-slider"></span>
                        </label>
                    </div>
                    <p class="cookie-option-desc">Nous aident à comprendre comment vous utilisez notre site pour l'améliorer.</p>
                </div>

                <div class="cookie-option">
                    <div class="cookie-option-header">
                        <span class="cookie-option-name">🎯 Cookies marketing</span>
                        <label class="cookie-toggle">
                            <input type="checkbox" id="cookie-marketing">
                            <span class="cookie-toggle-slider"></span>
                        </label>
                    </div>
                    <p class="cookie-option-desc">Utilisés pour vous proposer des publicités pertinentes sur d'autres sites.</p>
                </div>

                <div class="cookie-modal-actions">
                    <button class="cookie-btn cookie-btn-customize" onclick="window.hideCookiePreferences()">
                        Annuler
                    </button>
                    <button class="cookie-btn cookie-btn-accept" onclick="window.savePreferences()">
                        Enregistrer
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) window.hideCookiePreferences();
        });
    }

    function hideBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) banner.classList.remove('visible');
    }

    // Global functions
    window.acceptAllCookies = function () {
        setCookie({ essential: true, analytics: true, marketing: true });
        hideBanner();
        console.log('Cookies accepted: all');
    };

    window.rejectAllCookies = function () {
        setCookie({ essential: true, analytics: false, marketing: false });
        hideBanner();
        console.log('Cookies accepted: essential only');
    };

    window.showCookiePreferences = function () {
        const modal = document.getElementById('cookie-modal');
        if (modal) modal.classList.add('visible');
    };

    window.hideCookiePreferences = function () {
        const modal = document.getElementById('cookie-modal');
        if (modal) modal.classList.remove('visible');
    };

    window.savePreferences = function () {
        const analytics = document.getElementById('cookie-analytics').checked;
        const marketing = document.getElementById('cookie-marketing').checked;
        setCookie({ essential: true, analytics, marketing });
        hideBanner();
        window.hideCookiePreferences();
        console.log('Cookies saved:', { analytics, marketing });
    };

    function init() {
        // Check if already consented
        const existing = getCookie();
        if (existing) {
            console.log('Cookie consent already given:', existing);
            return;
        }

        injectStyles();
        createBanner();
        createModal();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
