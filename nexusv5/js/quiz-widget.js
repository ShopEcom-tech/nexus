/**
 * Recommendation Quiz Widget
 * Innovation #5: Guides visitors to the right plan
 * Can optionally save leads to Supabase
 */

(function () {
    'use strict';

    const QUIZ_CONFIG = {
        saveToDatabase: false, // Set to true to save leads to Supabase
        autoShowDelay: 10000, // Show after 10 seconds (set to 0 to disable)
        showOnOffrePage: true
    };

    const QUESTIONS = [
        {
            id: 'goal',
            question: "Quel est votre objectif principal ?",
            options: [
                { value: 'presence', label: '🏢 Présenter mon activité en ligne', points: { vitrine: 3, ecommerce: 1, surmesure: 1 } },
                { value: 'sell', label: '🛒 Vendre des produits/services', points: { vitrine: 0, ecommerce: 3, surmesure: 2 } },
                { value: 'custom', label: '🚀 Application sur-mesure', points: { vitrine: 0, ecommerce: 1, surmesure: 3 } }
            ]
        },
        {
            id: 'pages',
            question: "Combien de pages/produits estimez-vous ?",
            options: [
                { value: 'small', label: '📄 Moins de 5 pages', points: { vitrine: 3, ecommerce: 1, surmesure: 0 } },
                { value: 'medium', label: '📑 5 à 20 pages/produits', points: { vitrine: 1, ecommerce: 3, surmesure: 1 } },
                { value: 'large', label: '📚 Plus de 20', points: { vitrine: 0, ecommerce: 2, surmesure: 3 } }
            ]
        },
        {
            id: 'payment',
            question: "Avez-vous besoin de paiement en ligne ?",
            options: [
                { value: 'no', label: '❌ Non, pas besoin', points: { vitrine: 3, ecommerce: 0, surmesure: 1 } },
                { value: 'simple', label: '💳 Oui, paiement simple', points: { vitrine: 0, ecommerce: 3, surmesure: 1 } },
                { value: 'complex', label: '🔐 Oui, avec abonnements/options', points: { vitrine: 0, ecommerce: 1, surmesure: 3 } }
            ]
        },
        {
            id: 'budget',
            question: "Quel est votre budget approximatif ?",
            options: [
                { value: 'low', label: '💰 Moins de 300€', points: { vitrine: 3, ecommerce: 0, surmesure: 0 } },
                { value: 'medium', label: '💰💰 300€ - 700€', points: { vitrine: 1, ecommerce: 3, surmesure: 0 } },
                { value: 'high', label: '💰💰💰 Plus de 700€', points: { vitrine: 0, ecommerce: 1, surmesure: 3 } }
            ]
        }
    ];

    const PLANS = {
        vitrine: {
            name: 'Site Vitrine',
            price: '199€',
            color: '#4ade80',
            icon: '🏢',
            description: 'Parfait pour présenter votre activité',
            features: ['5 pages', 'Design moderne', 'Responsive', 'SEO de base']
        },
        ecommerce: {
            name: 'E-commerce',
            price: '399€',
            color: '#a78bfa',
            icon: '🛒',
            description: 'Lancez votre boutique en ligne',
            features: ['100 produits', 'Paiement sécurisé', 'Gestion stocks', 'Tableau de bord']
        },
        surmesure: {
            name: 'Sur-mesure',
            price: 'À partir de 799€',
            color: '#f472b6',
            icon: '🚀',
            description: 'Solution personnalisée',
            features: ['Architecture personnalisée', 'Intégrations API', 'Fonctionnalités uniques', 'SLA garanti']
        }
    };

    let currentQuestion = 0;
    let scores = { vitrine: 0, ecommerce: 0, surmesure: 0 };
    let answers = {};

    function injectStyles() {
        const styles = `
            .quiz-overlay {
                position: fixed;
                top: 0; left: 0; right: 0; bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(8px);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }
            
            .quiz-overlay.visible {
                opacity: 1;
                visibility: visible;
            }

            .quiz-container {
                background: linear-gradient(135deg, rgba(15, 15, 20, 0.98), rgba(25, 25, 35, 0.98));
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 24px;
                max-width: 560px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                padding: 40px;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
                transform: scale(0.9) translateY(20px);
                transition: transform 0.3s ease;
            }

            .quiz-overlay.visible .quiz-container {
                transform: scale(1) translateY(0);
            }

            .quiz-close {
                position: absolute;
                top: 16px;
                right: 16px;
                background: rgba(255, 255, 255, 0.1);
                border: none;
                color: #a1a1aa;
                width: 36px;
                height: 36px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
            }

            .quiz-close:hover {
                background: rgba(255, 255, 255, 0.2);
                color: white;
            }

            .quiz-header {
                text-align: center;
                margin-bottom: 32px;
            }

            .quiz-badge {
                display: inline-block;
                background: linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(236, 72, 153, 0.2));
                border: 1px solid rgba(124, 58, 237, 0.3);
                color: #c4b5fd;
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 13px;
                font-weight: 600;
                margin-bottom: 16px;
            }

            .quiz-title {
                font-size: 28px;
                font-weight: 700;
                color: white;
                margin: 0 0 8px 0;
            }

            .quiz-subtitle {
                color: #a1a1aa;
                font-size: 15px;
            }

            .quiz-progress {
                display: flex;
                gap: 8px;
                margin-bottom: 32px;
            }

            .quiz-progress-step {
                flex: 1;
                height: 4px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 2px;
                transition: background 0.3s;
            }

            .quiz-progress-step.completed {
                background: linear-gradient(135deg, #7c3aed, #db2777);
            }

            .quiz-progress-step.current {
                background: rgba(124, 58, 237, 0.5);
            }

            .quiz-question {
                font-size: 20px;
                font-weight: 600;
                color: white;
                margin-bottom: 24px;
                text-align: center;
            }

            .quiz-options {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .quiz-option {
                background: rgba(255, 255, 255, 0.03);
                border: 2px solid rgba(255, 255, 255, 0.1);
                border-radius: 16px;
                padding: 18px 24px;
                cursor: pointer;
                transition: all 0.2s;
                color: #e4e4e7;
                font-size: 16px;
                text-align: left;
            }

            .quiz-option:hover {
                background: rgba(124, 58, 237, 0.1);
                border-color: rgba(124, 58, 237, 0.3);
            }

            .quiz-option.selected {
                background: rgba(124, 58, 237, 0.15);
                border-color: #7c3aed;
            }

            /* Result Screen */
            .quiz-result {
                text-align: center;
            }

            .quiz-result-icon {
                font-size: 64px;
                margin-bottom: 16px;
            }

            .quiz-result-title {
                font-size: 24px;
                font-weight: 700;
                color: white;
                margin-bottom: 8px;
            }

            .quiz-result-plan {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 16px;
                padding: 24px;
                margin: 24px 0;
                border: 2px solid;
            }

            .quiz-result-plan-name {
                font-size: 28px;
                font-weight: 700;
                margin-bottom: 8px;
            }

            .quiz-result-plan-price {
                font-size: 36px;
                font-weight: 800;
                margin-bottom: 8px;
            }

            .quiz-result-plan-desc {
                color: #a1a1aa;
                margin-bottom: 16px;
            }

            .quiz-result-features {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                justify-content: center;
            }

            .quiz-result-feature {
                background: rgba(255, 255, 255, 0.1);
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 13px;
                color: #e4e4e7;
            }

            .quiz-result-cta {
                display: flex;
                gap: 12px;
                justify-content: center;
                margin-top: 24px;
            }

            .quiz-btn {
                padding: 14px 28px;
                border-radius: 12px;
                font-weight: 600;
                font-size: 15px;
                cursor: pointer;
                transition: all 0.2s;
                border: none;
            }

            .quiz-btn-primary {
                background: linear-gradient(135deg, #7c3aed, #db2777);
                color: white;
            }

            .quiz-btn-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 20px rgba(124, 58, 237, 0.3);
            }

            .quiz-btn-secondary {
                background: rgba(255, 255, 255, 0.1);
                color: white;
                border: 1px solid rgba(255, 255, 255, 0.2);
            }

            .quiz-btn-secondary:hover {
                background: rgba(255, 255, 255, 0.15);
            }

            /* Trigger Button */
            .quiz-trigger {
                background: linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(236, 72, 153, 0.1));
                border: 2px solid rgba(124, 58, 237, 0.3);
                border-radius: 16px;
                padding: 20px;
                margin-bottom: 40px;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s;
            }

            .quiz-trigger:hover {
                background: linear-gradient(135deg, rgba(124, 58, 237, 0.15), rgba(236, 72, 153, 0.15));
                border-color: rgba(124, 58, 237, 0.5);
                transform: translateY(-2px);
            }

            .quiz-trigger-text {
                color: white;
                font-size: 18px;
                font-weight: 600;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 12px;
            }

            .quiz-trigger-subtext {
                color: #a1a1aa;
                font-size: 14px;
                margin-top: 8px;
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    function createOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'quiz-overlay';
        overlay.id = 'quiz-overlay';
        overlay.innerHTML = `
            <div class="quiz-container" style="position: relative;">
                <button class="quiz-close" onclick="window.closeQuiz()">×</button>
                <div id="quiz-content"></div>
            </div>
        `;
        document.body.appendChild(overlay);

        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeQuiz();
        });
    }

    function renderQuestion() {
        const question = QUESTIONS[currentQuestion];
        const content = document.getElementById('quiz-content');

        content.innerHTML = `
            <div class="quiz-header">
                <div class="quiz-badge">🎯 Quiz Recommandation</div>
                <h2 class="quiz-title">Trouvez votre offre idéale</h2>
                <p class="quiz-subtitle">Question ${currentQuestion + 1} sur ${QUESTIONS.length}</p>
            </div>
            
            <div class="quiz-progress">
                ${QUESTIONS.map((_, i) => `
                    <div class="quiz-progress-step ${i < currentQuestion ? 'completed' : ''} ${i === currentQuestion ? 'current' : ''}"></div>
                `).join('')}
            </div>
            
            <div class="quiz-question">${question.question}</div>
            
            <div class="quiz-options">
                ${question.options.map((opt, i) => `
                    <div class="quiz-option" onclick="window.selectQuizOption(${i})">
                        ${opt.label}
                    </div>
                `).join('')}
            </div>
        `;
    }

    function renderResult() {
        // Determine winner
        let winner = 'vitrine';
        let maxScore = scores.vitrine;

        if (scores.ecommerce > maxScore) {
            winner = 'ecommerce';
            maxScore = scores.ecommerce;
        }
        if (scores.surmesure > maxScore) {
            winner = 'surmesure';
        }

        const plan = PLANS[winner];
        const content = document.getElementById('quiz-content');

        content.innerHTML = `
            <div class="quiz-result">
                <div class="quiz-result-icon">${plan.icon}</div>
                <div class="quiz-result-title">Nous vous recommandons...</div>
                
                <div class="quiz-result-plan" style="border-color: ${plan.color};">
                    <div class="quiz-result-plan-name" style="color: ${plan.color};">${plan.name}</div>
                    <div class="quiz-result-plan-price">${plan.price}</div>
                    <div class="quiz-result-plan-desc">${plan.description}</div>
                    
                    <div class="quiz-result-features">
                        ${plan.features.map(f => `<span class="quiz-result-feature">✓ ${f}</span>`).join('')}
                    </div>
                </div>
                
                <div class="quiz-result-cta">
                    <button class="quiz-btn quiz-btn-primary" onclick="window.location.href='contact.html'">
                        Demander un devis →
                    </button>
                    <button class="quiz-btn quiz-btn-secondary" onclick="window.restartQuiz()">
                        Recommencer
                    </button>
                </div>
            </div>
        `;

        // Optional: Save lead to database
        if (QUIZ_CONFIG.saveToDatabase && window.supabaseClient) {
            saveQuizLead(winner, answers, scores);
        }
    }

    async function saveQuizLead(recommendedPlan, answers, scores) {
        try {
            await window.supabaseClient.from('quiz_leads').insert({
                recommended_plan: recommendedPlan,
                answers: answers,
                scores: scores,
                created_at: new Date().toISOString()
            });
            console.log('Quiz lead saved to database');
        } catch (error) {
            console.error('Error saving quiz lead:', error);
        }
    }

    // Global functions
    window.openQuiz = function () {
        const overlay = document.getElementById('quiz-overlay');
        overlay.classList.add('visible');
        renderQuestion();
    };

    window.closeQuiz = function () {
        const overlay = document.getElementById('quiz-overlay');
        overlay.classList.remove('visible');
    };

    window.selectQuizOption = function (optionIndex) {
        const question = QUESTIONS[currentQuestion];
        const option = question.options[optionIndex];

        // Save answer
        answers[question.id] = option.value;

        // Add points
        scores.vitrine += option.points.vitrine;
        scores.ecommerce += option.points.ecommerce;
        scores.surmesure += option.points.surmesure;

        // Visual feedback
        const options = document.querySelectorAll('.quiz-option');
        options.forEach((el, i) => {
            el.classList.toggle('selected', i === optionIndex);
        });

        // Next question or result
        setTimeout(() => {
            currentQuestion++;
            if (currentQuestion < QUESTIONS.length) {
                renderQuestion();
            } else {
                renderResult();
            }
        }, 300);
    };

    window.restartQuiz = function () {
        currentQuestion = 0;
        scores = { vitrine: 0, ecommerce: 0, surmesure: 0 };
        answers = {};
        renderQuestion();
    };

    function createTriggerButton() {
        // Only on offres page
        if (!window.location.pathname.includes('offres')) return null;

        const container = document.querySelector('.pricing-grid');
        if (!container) return null;

        const trigger = document.createElement('div');
        trigger.className = 'quiz-trigger';
        trigger.onclick = window.openQuiz;
        trigger.innerHTML = `
            <div class="quiz-trigger-text">
                🎯 Pas sûr de l'offre idéale ?
            </div>
            <div class="quiz-trigger-subtext">
                Répondez à 4 questions et trouvez votre solution en 30 secondes
            </div>
        `;

        container.parentNode.insertBefore(trigger, container);
    }

    function init() {
        injectStyles();
        createOverlay();
        createTriggerButton();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
