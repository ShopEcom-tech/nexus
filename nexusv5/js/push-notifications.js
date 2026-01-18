/**
 * Push Notifications Request
 * Innovation #26: Ask permission for browser notifications
 */

(function () {
    'use strict';

    const CONFIG = {
        delay: 15000, // Ask after 15 seconds
        cookieName: 'nexus_push_asked',
        title: '🔔 Restez informé !',
        message: 'Activez les notifications pour recevoir nos offres exclusives et mises à jour.',
        acceptText: 'Activer',
        declineText: 'Plus tard'
    };

    function injectStyles() {
        const styles = `
            .push-prompt {
                position: fixed;
                top: 100px;
                right: 24px;
                background: rgba(15, 15, 20, 0.98);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(124, 58, 237, 0.3);
                border-radius: 16px;
                padding: 24px;
                max-width: 320px;
                z-index: 99997;
                opacity: 0;
                visibility: hidden;
                transform: translateX(100%);
                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
            }

            .push-prompt.visible {
                opacity: 1;
                visibility: visible;
                transform: translateX(0);
            }

            .push-prompt-icon {
                font-size: 40px;
                margin-bottom: 12px;
            }

            .push-prompt-title {
                font-size: 18px;
                font-weight: 700;
                color: white;
                margin-bottom: 8px;
            }

            .push-prompt-message {
                color: #a1a1aa;
                font-size: 14px;
                line-height: 1.6;
                margin-bottom: 16px;
            }

            .push-prompt-actions {
                display: flex;
                gap: 10px;
            }

            .push-prompt-btn {
                flex: 1;
                padding: 10px 16px;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
                border: none;
            }

            .push-prompt-accept {
                background: linear-gradient(135deg, #7c3aed, #db2777);
                color: white;
            }

            .push-prompt-accept:hover {
                transform: scale(1.02);
            }

            .push-prompt-decline {
                background: rgba(255, 255, 255, 0.1);
                color: #a1a1aa;
            }

            .push-prompt-decline:hover {
                background: rgba(255, 255, 255, 0.15);
            }

            @media (max-width: 480px) {
                .push-prompt {
                    right: 16px;
                    left: 16px;
                    max-width: none;
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    function isAsked() {
        return localStorage.getItem(CONFIG.cookieName) === 'true';
    }

    function setAsked() {
        localStorage.setItem(CONFIG.cookieName, 'true');
    }

    function createPrompt() {
        const prompt = document.createElement('div');
        prompt.className = 'push-prompt';
        prompt.id = 'push-prompt';

        prompt.innerHTML = `
            <div class="push-prompt-icon">🔔</div>
            <div class="push-prompt-title">${CONFIG.title}</div>
            <p class="push-prompt-message">${CONFIG.message}</p>
            <div class="push-prompt-actions">
                <button class="push-prompt-btn push-prompt-decline" onclick="window.declinePush()">
                    ${CONFIG.declineText}
                </button>
                <button class="push-prompt-btn push-prompt-accept" onclick="window.acceptPush()">
                    ${CONFIG.acceptText}
                </button>
            </div>
        `;

        document.body.appendChild(prompt);
    }

    function showPrompt() {
        const prompt = document.getElementById('push-prompt');
        if (prompt) {
            prompt.classList.add('visible');
        }
    }

    function hidePrompt() {
        const prompt = document.getElementById('push-prompt');
        if (prompt) {
            prompt.classList.remove('visible');
            setAsked();
        }
    }

    window.acceptPush = async function () {
        hidePrompt();

        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                new Notification('Web Shop', {
                    body: 'Merci ! Vous recevrez nos meilleures offres.',
                    icon: '/images/logo.png'
                });
            }
        }
    };

    window.declinePush = function () {
        hidePrompt();
    };

    function init() {
        if (!('Notification' in window)) return;
        if (Notification.permission === 'granted') return;
        if (Notification.permission === 'denied') return;
        if (isAsked()) return;

        injectStyles();
        createPrompt();

        setTimeout(showPrompt, CONFIG.delay);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
