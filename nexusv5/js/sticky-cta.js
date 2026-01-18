/**
 * Sticky CTA Bar
 * Innovation #22: Fixed call-to-action bar that appears on scroll
 */

(function () {
    'use strict';

    const CONFIG = {
        showAfter: 600, // Show after scrolling 600px
        text: 'Prêt à lancer votre projet ?',
        buttonText: 'Demander un devis gratuit',
        buttonLink: 'pages/contact.html',
        showOnPages: ['index', 'offres', 'services']
    };

    function injectStyles() {
        const styles = `
            .sticky-cta {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: rgba(15, 15, 20, 0.98);
                backdrop-filter: blur(20px);
                border-top: 1px solid rgba(124, 58, 237, 0.3);
                padding: 16px 24px;
                z-index: 9994;
                transform: translateY(100%);
                transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 24px;
            }

            .sticky-cta.visible {
                transform: translateY(0);
            }

            .sticky-cta-text {
                color: #e4e4e7;
                font-size: 15px;
                font-weight: 500;
            }

            .sticky-cta-button {
                background: linear-gradient(135deg, #7c3aed, #db2777);
                color: white;
                padding: 12px 28px;
                border-radius: 10px;
                font-size: 14px;
                font-weight: 600;
                text-decoration: none;
                transition: all 0.3s;
                white-space: nowrap;
            }

            .sticky-cta-button:hover {
                transform: scale(1.05);
                box-shadow: 0 8px 25px rgba(124, 58, 237, 0.4);
            }

            .sticky-cta-close {
                position: absolute;
                right: 16px;
                background: none;
                border: none;
                color: #71717a;
                font-size: 20px;
                cursor: pointer;
                padding: 4px;
            }

            .sticky-cta-close:hover {
                color: white;
            }

            /* Adjust other fixed elements */
            body.has-sticky-cta .whatsapp-button,
            body.has-sticky-cta .chatbot-toggle,
            body.has-sticky-cta .back-to-top,
            body.has-sticky-cta .theme-toggle {
                bottom: 80px;
            }

            @media (max-width: 600px) {
                .sticky-cta {
                    flex-direction: column;
                    gap: 12px;
                    padding: 14px 20px;
                }

                .sticky-cta-text {
                    font-size: 14px;
                    text-align: center;
                }

                body.has-sticky-cta .whatsapp-button,
                body.has-sticky-cta .chatbot-toggle,
                body.has-sticky-cta .back-to-top,
                body.has-sticky-cta .theme-toggle {
                    bottom: 120px;
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    function shouldShowOnCurrentPage() {
        const path = window.location.pathname.toLowerCase();
        return CONFIG.showOnPages.some(page =>
            path.includes(page) || path === '/' || path.endsWith('/index.html')
        );
    }

    function createCTA() {
        const cta = document.createElement('div');
        cta.className = 'sticky-cta';
        cta.id = 'sticky-cta';

        cta.innerHTML = `
            <span class="sticky-cta-text">${CONFIG.text}</span>
            <a href="${CONFIG.buttonLink}" class="sticky-cta-button">${CONFIG.buttonText}</a>
            <button class="sticky-cta-close" onclick="window.closeStickyC TA()">×</button>
        `;

        document.body.appendChild(cta);
    }

    let isHidden = false;

    window.closeStickyCTA = function () {
        const cta = document.getElementById('sticky-cta');
        if (cta) {
            cta.classList.remove('visible');
            document.body.classList.remove('has-sticky-cta');
            isHidden = true;
        }
    };

    function handleScroll() {
        if (isHidden) return;

        const cta = document.getElementById('sticky-cta');
        if (!cta) return;

        if (window.scrollY > CONFIG.showAfter) {
            cta.classList.add('visible');
            document.body.classList.add('has-sticky-cta');
        } else {
            cta.classList.remove('visible');
            document.body.classList.remove('has-sticky-cta');
        }
    }

    function init() {
        if (!shouldShowOnCurrentPage()) return;

        injectStyles();
        createCTA();

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
