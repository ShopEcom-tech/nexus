/**
 * Newsletter Subscription Widget
 * Innovation #18: Timed popup for email collection
 */

(function () {
    'use strict';

    const NEWSLETTER_CONFIG = {
        enabled: true,
        delay: 30000, // Show after 30 seconds
        cookieName: 'nexus_newsletter_shown',
        title: '📧 Restez informé !',
        subtitle: 'Recevez nos conseils exclusifs pour booster votre présence web',
        placeholder: 'Votre adresse email',
        buttonText: 'S\'inscrire',
        privacyText: 'Pas de spam, promis. Désinscription en 1 clic.'
    };

    function injectStyles() {
        const styles = `
            .newsletter-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.75);
                backdrop-filter: blur(8px);
                z-index: 99998;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: all 0.4s ease;
            }

            .newsletter-overlay.visible {
                opacity: 1;
                visibility: visible;
            }

            .newsletter-popup {
                background: linear-gradient(135deg, #0f0f17 0%, #1a1a2e 100%);
                border: 1px solid rgba(124, 58, 237, 0.3);
                border-radius: 24px;
                padding: 48px;
                max-width: 450px;
                width: 90%;
                text-align: center;
                position: relative;
                transform: translateY(30px) scale(0.95);
                transition: transform 0.4s ease;
            }

            .newsletter-overlay.visible .newsletter-popup {
                transform: translateY(0) scale(1);
            }

            .newsletter-close {
                position: absolute;
                top: 16px;
                right: 16px;
                background: none;
                border: none;
                color: #71717a;
                font-size: 24px;
                cursor: pointer;
                transition: color 0.2s;
            }

            .newsletter-close:hover {
                color: white;
            }

            .newsletter-icon {
                font-size: 56px;
                margin-bottom: 16px;
            }

            .newsletter-title {
                font-size: 26px;
                font-weight: 700;
                color: white;
                margin-bottom: 8px;
            }

            .newsletter-subtitle {
                color: #a1a1aa;
                font-size: 15px;
                line-height: 1.6;
                margin-bottom: 24px;
            }

            .newsletter-form {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .newsletter-input {
                width: 100%;
                padding: 16px 20px;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                color: white;
                font-size: 15px;
                text-align: center;
                transition: border-color 0.2s;
            }

            .newsletter-input:focus {
                outline: none;
                border-color: #7c3aed;
            }

            .newsletter-input::placeholder {
                color: #71717a;
            }

            .newsletter-submit {
                width: 100%;
                padding: 16px;
                background: linear-gradient(135deg, #7c3aed, #db2777);
                border: none;
                border-radius: 12px;
                color: white;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s;
            }

            .newsletter-submit:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 30px rgba(124, 58, 237, 0.4);
            }

            .newsletter-privacy {
                color: #52525b;
                font-size: 12px;
                margin-top: 12px;
            }

            .newsletter-success {
                display: none;
            }

            .newsletter-success.visible {
                display: block;
            }

            .newsletter-success-icon {
                font-size: 64px;
                margin-bottom: 16px;
            }

            .newsletter-success-text {
                color: #4ade80;
                font-size: 18px;
                font-weight: 600;
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    function isShown() {
        return localStorage.getItem(NEWSLETTER_CONFIG.cookieName) === 'true';
    }

    function setShown() {
        localStorage.setItem(NEWSLETTER_CONFIG.cookieName, 'true');
    }

    function createPopup() {
        const overlay = document.createElement('div');
        overlay.className = 'newsletter-overlay';
        overlay.id = 'newsletter-overlay';

        overlay.innerHTML = `
            <div class="newsletter-popup">
                <button class="newsletter-close" onclick="window.closeNewsletter()">×</button>
                
                <div id="newsletter-form-container">
                    <div class="newsletter-icon">📧</div>
                    <h2 class="newsletter-title">${NEWSLETTER_CONFIG.title}</h2>
                    <p class="newsletter-subtitle">${NEWSLETTER_CONFIG.subtitle}</p>
                    
                    <form class="newsletter-form" onsubmit="window.submitNewsletter(event)">
                        <input type="email" class="newsletter-input" id="newsletter-email" 
                            placeholder="${NEWSLETTER_CONFIG.placeholder}" required>
                        <button type="submit" class="newsletter-submit">${NEWSLETTER_CONFIG.buttonText}</button>
                    </form>
                    
                    <p class="newsletter-privacy">${NEWSLETTER_CONFIG.privacyText}</p>
                </div>
                
                <div id="newsletter-success" class="newsletter-success">
                    <div class="newsletter-success-icon">✅</div>
                    <div class="newsletter-success-text">Merci ! Vous êtes inscrit.</div>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) window.closeNewsletter();
        });
    }

    window.closeNewsletter = function () {
        const overlay = document.getElementById('newsletter-overlay');
        if (overlay) {
            overlay.classList.remove('visible');
            setShown();
        }
    };

    window.submitNewsletter = async function (e) {
        e.preventDefault();

        const email = document.getElementById('newsletter-email').value;
        const formContainer = document.getElementById('newsletter-form-container');
        const success = document.getElementById('newsletter-success');

        // Here you would normally send to your email service
        console.log('Newsletter signup:', email);

        // Show success
        formContainer.style.display = 'none';
        success.classList.add('visible');

        setShown();

        // Close after 2 seconds
        setTimeout(window.closeNewsletter, 2000);
    };

    function showPopup() {
        const overlay = document.getElementById('newsletter-overlay');
        if (overlay) {
            overlay.classList.add('visible');
        }
    }

    function init() {
        if (!NEWSLETTER_CONFIG.enabled) return;
        if (isShown()) return;

        injectStyles();
        createPopup();

        // Show after delay
        setTimeout(showPopup, NEWSLETTER_CONFIG.delay);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
