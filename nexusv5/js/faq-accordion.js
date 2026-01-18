/**
 * FAQ Accordion Widget
 * Innovation #14: Interactive FAQ section
 */

(function () {
    'use strict';

    const FAQ_DATA = [
        {
            question: "Combien de temps pour créer mon site ?",
            answer: "Selon la complexité : Site vitrine (2 semaines), E-commerce (4 semaines), Sur-mesure (6+ semaines). Nous vous tenons informé à chaque étape."
        },
        {
            question: "Quels sont les modes de paiement acceptés ?",
            answer: "Nous acceptons les virements bancaires, cartes de crédit (via Stripe) et PayPal. Un acompte de 30% est demandé au démarrage."
        },
        {
            question: "Puis-je modifier mon site moi-même ?",
            answer: "Oui ! Nous livrons avec un panneau d'administration intuitif. Formation incluse pour vous rendre autonome."
        },
        {
            question: "Le site sera-t-il optimisé pour mobile ?",
            answer: "Absolument. Tous nos sites sont responsive et testés sur tous les appareils (mobile, tablette, desktop)."
        },
        {
            question: "Proposez-vous la maintenance ?",
            answer: "Oui, nous proposons des forfaits de maintenance mensuelle incluant mises à jour, sauvegardes et support technique."
        },
        {
            question: "Et si je ne suis pas satisfait ?",
            answer: "Nous offrons des révisions illimitées jusqu'à satisfaction. Si malgré tout vous n'êtes pas content, remboursement garanti sous 30 jours."
        }
    ];

    function injectStyles() {
        const styles = `
            .faq-section {
                padding: 80px 0;
            }

            .faq-container {
                max-width: 800px;
                margin: 0 auto;
                padding: 0 24px;
            }

            .faq-header {
                text-align: center;
                margin-bottom: 48px;
            }

            .faq-badge {
                display: inline-block;
                background: linear-gradient(135deg, rgba(124, 58, 237, 0.15), rgba(236, 72, 153, 0.15));
                border: 1px solid rgba(124, 58, 237, 0.3);
                color: #c4b5fd;
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 13px;
                font-weight: 600;
                margin-bottom: 16px;
            }

            .faq-title {
                font-size: 36px;
                font-weight: 700;
                color: white;
                margin: 0;
            }

            .faq-list {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .faq-item {
                background: rgba(255, 255, 255, 0.02);
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-radius: 16px;
                overflow: hidden;
                transition: all 0.3s ease;
            }

            .faq-item:hover {
                border-color: rgba(124, 58, 237, 0.3);
            }

            .faq-item.active {
                border-color: rgba(124, 58, 237, 0.5);
                background: rgba(124, 58, 237, 0.05);
            }

            .faq-question {
                padding: 20px 24px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 16px;
            }

            .faq-question-text {
                font-size: 16px;
                font-weight: 600;
                color: white;
            }

            .faq-icon {
                width: 24px;
                height: 24px;
                flex-shrink: 0;
                position: relative;
            }

            .faq-icon::before,
            .faq-icon::after {
                content: '';
                position: absolute;
                background: #a78bfa;
                transition: transform 0.3s ease;
            }

            .faq-icon::before {
                width: 12px;
                height: 2px;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }

            .faq-icon::after {
                width: 2px;
                height: 12px;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }

            .faq-item.active .faq-icon::after {
                transform: translate(-50%, -50%) rotate(90deg);
            }

            .faq-answer {
                max-height: 0;
                overflow: hidden;
                transition: max-height 0.3s ease, padding 0.3s ease;
            }

            .faq-item.active .faq-answer {
                max-height: 200px;
            }

            .faq-answer-text {
                padding: 0 24px 20px;
                color: #a1a1aa;
                font-size: 15px;
                line-height: 1.7;
            }

            @media (max-width: 600px) {
                .faq-title {
                    font-size: 28px;
                }

                .faq-question-text {
                    font-size: 15px;
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    function createFAQ() {
        // Find insertion point (before footer on offres page)
        const footer = document.querySelector('footer');
        if (!footer) return;

        // Only show on certain pages
        const path = window.location.pathname.toLowerCase();
        if (!path.includes('offres') && !path.includes('services')) return;

        const section = document.createElement('section');
        section.className = 'faq-section';
        section.id = 'faq';

        section.innerHTML = `
            <div class="faq-container">
                <div class="faq-header">
                    <span class="faq-badge">❓ FAQ</span>
                    <h2 class="faq-title">Questions Fréquentes</h2>
                </div>
                <div class="faq-list">
                    ${FAQ_DATA.map((item, i) => `
                        <div class="faq-item" data-index="${i}">
                            <div class="faq-question" onclick="window.toggleFAQ(${i})">
                                <span class="faq-question-text">${item.question}</span>
                                <span class="faq-icon"></span>
                            </div>
                            <div class="faq-answer">
                                <p class="faq-answer-text">${item.answer}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        footer.parentNode.insertBefore(section, footer);
    }

    window.toggleFAQ = function (index) {
        const items = document.querySelectorAll('.faq-item');
        items.forEach((item, i) => {
            if (i === index) {
                item.classList.toggle('active');
            } else {
                item.classList.remove('active');
            }
        });
    };

    function init() {
        injectStyles();
        createFAQ();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
