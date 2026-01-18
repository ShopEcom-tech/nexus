/**
 * WhatsApp Floating Button Widget
 * Adds a floating WhatsApp button for instant customer contact
 * Innovation #2: +40% response rate according to studies
 */

(function () {
    'use strict';

    // Configuration - REMPLACER PAR VOTRE NUMÉRO
    const WHATSAPP_CONFIG = {
        phoneNumber: '33123456789', // Format: country code + number (no + or spaces)
        defaultMessage: 'Bonjour ! Je visite votre site Web Shop et j\'aimerais en savoir plus sur vos services de création de sites web.',
        position: 'left', // 'left' or 'right' (chatbot is on right)
        showOnMobile: true,
        showTooltip: true,
        tooltipText: 'Discuter sur WhatsApp',
        delayMs: 2000 // Show after 2 seconds
    };

    // Inject CSS
    function injectStyles() {
        const styles = `
            .whatsapp-widget {
                position: fixed;
                bottom: 90px;
                ${WHATSAPP_CONFIG.position}: 32px;
                z-index: 9998;
                font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
                opacity: 0;
                transform: scale(0.8) translateY(20px);
                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }

            .whatsapp-widget.visible {
                opacity: 1;
                transform: scale(1) translateY(0);
            }

            .whatsapp-button {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: linear-gradient(135deg, #25D366, #128C7E);
                border: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 
                    0 6px 24px rgba(37, 211, 102, 0.4),
                    0 0 0 3px rgba(37, 211, 102, 0.1);
                transition: all 0.3s ease;
                position: relative;
            }

            .whatsapp-button:hover {
                transform: scale(1.1);
                box-shadow: 
                    0 8px 32px rgba(37, 211, 102, 0.5),
                    0 0 0 5px rgba(37, 211, 102, 0.15);
            }

            .whatsapp-button:active {
                transform: scale(0.95);
            }

            .whatsapp-button svg {
                width: 32px;
                height: 32px;
                fill: white;
            }

            /* Pulse animation */
            .whatsapp-button::before {
                content: '';
                position: absolute;
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background: linear-gradient(135deg, #25D366, #128C7E);
                animation: whatsapp-pulse 2s ease-out infinite;
                z-index: -1;
            }

            @keyframes whatsapp-pulse {
                0% { transform: scale(1); opacity: 0.5; }
                100% { transform: scale(1.5); opacity: 0; }
            }

            /* Tooltip */
            .whatsapp-tooltip {
                position: absolute;
                ${WHATSAPP_CONFIG.position === 'left' ? 'left: 70px' : 'right: 70px'};
                top: 50%;
                transform: translateY(-50%);
                background: rgba(15, 15, 20, 0.95);
                backdrop-filter: blur(10px);
                color: white;
                padding: 10px 16px;
                border-radius: 12px;
                font-size: 14px;
                font-weight: 500;
                white-space: nowrap;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                border: 1px solid rgba(255, 255, 255, 0.1);
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            }

            .whatsapp-tooltip::before {
                content: '';
                position: absolute;
                ${WHATSAPP_CONFIG.position === 'left' ? 'left: -6px' : 'right: -6px'};
                top: 50%;
                transform: translateY(-50%) rotate(45deg);
                width: 12px;
                height: 12px;
                background: rgba(15, 15, 20, 0.95);
                border-${WHATSAPP_CONFIG.position === 'left' ? 'left' : 'right'}: 1px solid rgba(255, 255, 255, 0.1);
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }

            .whatsapp-widget:hover .whatsapp-tooltip {
                opacity: 1;
                visibility: visible;
            }

            /* Online indicator */
            .whatsapp-online {
                position: absolute;
                top: 2px;
                right: 2px;
                width: 14px;
                height: 14px;
                background: #4ADE80;
                border-radius: 50%;
                border: 2px solid #128C7E;
                animation: online-blink 2s infinite;
            }

            @keyframes online-blink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
            }

            /* Mobile adjustments */
            @media (max-width: 480px) {
                .whatsapp-widget {
                    bottom: 100px; /* Above mobile nav */
                    ${WHATSAPP_CONFIG.position}: 16px;
                }
                
                .whatsapp-button {
                    width: 52px;
                    height: 52px;
                }

                .whatsapp-button svg {
                    width: 28px;
                    height: 28px;
                }

                .whatsapp-tooltip {
                    display: none;
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    // Create widget HTML
    function createWidget() {
        const widget = document.createElement('div');
        widget.className = 'whatsapp-widget';
        widget.id = 'whatsapp-widget';

        const encodedMessage = encodeURIComponent(WHATSAPP_CONFIG.defaultMessage);
        const whatsappUrl = `https://wa.me/${WHATSAPP_CONFIG.phoneNumber}?text=${encodedMessage}`;

        widget.innerHTML = `
            <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="whatsapp-button" aria-label="Chat on WhatsApp">
                <span class="whatsapp-online"></span>
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                ${WHATSAPP_CONFIG.showTooltip ? `<span class="whatsapp-tooltip">${WHATSAPP_CONFIG.tooltipText}</span>` : ''}
            </a>
        `;

        document.body.appendChild(widget);

        // Show with delay
        setTimeout(() => {
            widget.classList.add('visible');
        }, WHATSAPP_CONFIG.delayMs);
    }

    // Initialize
    function init() {
        // Check if on mobile and mobile is disabled
        if (!WHATSAPP_CONFIG.showOnMobile && window.innerWidth < 768) {
            return;
        }

        injectStyles();

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createWidget);
        } else {
            createWidget();
        }
    }

    init();
})();
