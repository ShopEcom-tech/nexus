/**
 * Language Switcher
 * Innovation #30: FR/EN toggle with translations
 */

(function () {
    'use strict';

    const CONFIG = {
        defaultLang: 'fr',
        storageKey: 'nexus_language'
    };

    const TRANSLATIONS = {
        fr: {
            // Navigation
            'nav.home': 'Accueil',
            'nav.offers': 'Offres',
            'nav.portfolio': 'Portfolio',
            'nav.testimonials': 'Témoignages',
            'nav.services': 'Services',
            'nav.contact': 'Contact',

            // Hero (Home)
            'hero.badge': 'Agence créative premium',
            'hero.title': 'Créons votre',
            'hero.title2': 'présence digitale',
            'hero.title3': 'de demain',
            'hero.subtitle': 'Nous concevons des expériences web extraordinaires qui captivent vos visiteurs et transforment votre vision en réalité digitale.',
            'hero.cta': 'Démarrer un projet',
            'hero.cta2': 'Découvrir nos offres',

            // Stats (Home)
            'stat.projects': 'Projets livrés',
            'stat.clients': 'Clients satisfaits',
            'stat.experience': 'D\'expérience',
            'stat.support': 'Support client',

            // Benefits (Home)
            'home.benefits.title': 'Pourquoi choisir',
            'home.benefits.titleQuestion': '?',
            'home.benefits.subtitle1': 'On ne vous vend pas un joli site.',
            'home.benefits.subtitleStrong': 'On vous promet du chiffre d\'affaires.',
            'home.benefits.subtitle2': 'Nos clients génèrent en moyenne',
            'home.benefits.subtitleGradient': '+40% de revenus',
            'home.benefits.subtitleEnd': 'après 6 mois.',
            'home.benefits.link': 'Voir tous nos services →',

            // Benefit Cards (Home)
            'home.benefit1.title': '+40% de Conversions',
            'home.benefit1.desc': 'Chaque élément est optimisé pour transformer vos visiteurs en clients payants. Pas de décoration inutile, que du résultat.',
            'home.benefit2.title': 'ROI Garanti',
            'home.benefit2.desc': 'Votre investissement doit rapporter. Nos sites sont conçus pour générer des ventes, pas juste pour faire joli.',
            'home.benefit3.title': 'Stratégie Business',
            'home.benefit3.desc': 'On analyse votre marché, vos concurrents et vos clients pour créer un site qui vend vraiment.',

            // Social Proof (Home)
            'home.proof1.label': 'Générés pour nos clients',
            'home.proof2.label': 'Trafic moyen en 3 mois',
            'home.proof3.label': 'Pour voir les premiers résultats',

            // Guarantee (Home)
            'home.guarantee.title': 'Inclus avec votre',
            'home.guarantee.subscription': 'abonnement',
            'home.guarantee.desc1': 'On ne vous laisse pas seul après la livraison. Votre succès, c\'est notre priorité.',
            'home.guarantee.descStrong': 'Un accompagnement complet pour maximiser vos résultats.',
            'home.guarantee.badge1': '✓ Support illimité',
            'home.guarantee.badge2': '✓ Optimisations gratuites',
            'home.guarantee.badge3': '✓ Mises à jour régulières',
            'home.guarantee.badge4': '✓ Conseils personnalisés',

            // Pricing Page
            'pricing.badge': '🌐 Sites Web',
            'pricing.title.start': 'Créez votre',
            'pricing.title.end': 'Site Web',
            'pricing.subtitle': 'Du site vitrine à la boutique e-commerce complète. Prix négociables pour tous les budgets.',
            'pricing.app.question': '📱 Vous cherchez une application ?',
            'pricing.app.link': 'Voir nos offres d\'applications →',
            'pricing.popular': '⭐ Populaire',
            'pricing.period.once': 'Paiement unique',
            'pricing.period.from': 'À partir de',
            'pricing.negotiable': '💬 Prix négociable selon vos besoins',
            'pricing.trust.label': 'Ils nous font confiance',
            'pricing.btn.cart': '🛒 Ajouter au panier',
            'pricing.btn.viewCart': '🛒 Voir mon panier',

            // Pricing Cards Features
            'pricing.card1.title': 'Site Vitrine',
            'pricing.card1.desc': 'Parfait pour présenter votre activité',
            'pricing.card1.delivery': '⏱️ Livraison: 2 semaines',
            'pricing.card1.feat1': 'Design sur-mesure',
            'pricing.card1.feat2': 'Jusqu\'à 5 pages',
            'pricing.card1.feat3': 'Responsive (mobile, tablette)',
            'pricing.card1.feat4': 'Optimisation SEO de base',
            'pricing.card1.feat5': 'Formulaire de contact',
            'pricing.card1.feat6': 'Hébergement 1 an offert',

            'pricing.card2.title': 'E-commerce',
            'pricing.card2.desc': 'Lancez votre boutique en ligne',
            'pricing.card2.delivery': '⏱️ Livraison: 4 semaines',
            'pricing.card2.feat1': 'Tout du plan Vitrine',
            'pricing.card2.feat2': 'Jusqu\'à 100 produits',
            'pricing.card2.feat3': 'Paiement sécurisé (Stripe)',
            'pricing.card2.feat4': 'Gestion des stocks',
            'pricing.card2.feat5': 'Tableau de bord admin',
            'pricing.card2.feat6': 'Formation incluse',
            'pricing.card2.feat7': 'Support prioritaire 6 mois',

            'pricing.card3.title': 'Sur-mesure',
            'pricing.card3.desc': 'Solution personnalisée à vos besoins',
            'pricing.card3.delivery': '⏱️ Livraison: 6+ semaines',
            'pricing.card3.feat1': 'Architecture personnalisée',
            'pricing.card3.feat2': 'Fonctionnalités sur-mesure',
            'pricing.card3.feat3': 'Intégrations API tierces',
            'pricing.card3.feat4': 'Performances optimisées',
            'pricing.card3.feat5': 'Accompagnement dédié',
            'pricing.card3.feat6': 'Maintenance premium',
            'pricing.card3.feat7': 'SLA garanti',

            // Portfolio Page
            'portfolio.header.badge': 'Nos Réalisations',
            'portfolio.header.title': 'Nos Projets',
            'portfolio.header.titleGradient': 'Récents',
            'portfolio.header.subtitle': 'Découvrez comment nous avons aidé nos clients à transformer leur vision en réalité digitale.',

            'portfolio.alpha.badge': '⭐ Projet Vedette',
            'portfolio.alpha.titleSuffix': 'Plateforme éducative IA',
            'portfolio.alpha.subtitle': 'Transformation complète de l\'expérience d\'apprentissage en ligne',
            'portfolio.alpha.cardTitle': 'Le Défi',
            'portfolio.alpha.desc1': 'Alpha Academy souhaitait moderniser sa plateforme de cours en ligne vieillissante. L\'objectif était de créer une expérience immersive, intégrant de l\'intelligence artificielle pour personnaliser l\'apprentissage.',
            'portfolio.alpha.desc2': 'Nous avons conçu une architecture moderne basée sur React et Node.js, intégrant un tuteur IA personnalisé pour chaque étudiant.',
            'portfolio.alpha.stat1': 'IA Tutor',
            'portfolio.alpha.stat2': 'Paiements',
            'portfolio.alpha.stat3': 'Analytics',
            'portfolio.alpha.cta': 'Voir le site en direct',
            'portfolio.alpha.slogan': 'L\'éducation réinventée par l\'IA',

            'portfolio.edu.badge': '🚀 E-commerce',
            'portfolio.edu.titleSuffix': 'Comparateur de formations',
            'portfolio.edu.subtitle': 'Une place de marché intuitive pour la formation professionnelle',
            'portfolio.edu.cardTitle': 'La Solution',
            'portfolio.edu.desc1': 'Création d\'un comparateur de formations intelligent permettant de filtrer parmi des milliers d\'offres. Interface fluide et système de recommandation avancé.',
            'portfolio.edu.desc2': 'Une augmentation de 200% du taux de conversion dès le premier mois grâce à une UX optimisée.',
            'portfolio.edu.stat1': 'Analytics',
            'portfolio.edu.stat2': 'Vrais Avis',
            'portfolio.edu.stat3': 'Taux Réussite',
            'portfolio.edu.stat4': 'Débouchés',
            'portfolio.edu.partner': 'Partenaire Officiel',
            'portfolio.edu.cta': 'Voir l\'étude de cas',

            'portfolio.client.title': 'Projets Clients',
            'portfolio.cat.showcase': 'Site Vitrine',
            'portfolio.cat.ecommerce': 'E-commerce',
            'portfolio.cat.app': 'Application',

            'portfolio.client1.desc': 'Refonte complète de l\'identité visuelle et du site web.',
            'portfolio.client2.desc': 'Boutique en ligne de vêtements avec essayage virtuel.',
            'portfolio.client3.desc': 'Application de gestion de tâches pour équipes.',
            'portfolio.client4.desc': 'Site de réservation pour un restaurant étoilé.',
            'portfolio.client5.desc': 'Plateforme immobilière avec visites virtuelles.',
            'portfolio.client6.desc': 'App de coaching sportif avec suivi temps réel.',

            'portfolio.reservations': 'Réservations',
            'portfolio.sales': 'Ventes',
            'portfolio.downloads': 'Télécharg.',
            'portfolio.calls': 'Appels',
            'portfolio.leads': 'Leads',
            'portfolio.requests': 'Demandes',

            'portfolio.more.text': 'Et bien plus encore...',
            'portfolio.more.btn': 'Voir tous les projets',

            // Trust Badges
            'trust.secure.title': 'Paiement 100% Sécurisé',
            'trust.secure.subtitle': 'Cryptage SSL 256-bit',
            'trust.satisfaction.title': 'Satisfaction Garantie',
            'trust.satisfaction.subtitle': '30 jours satisfait ou remboursé',
            'trust.support.title': 'Support Réactif',
            'trust.support.subtitle': 'Réponse sous 24h',
            'trust.rating.title': '50+ Projets',
            'trust.rating.subtitle': '98% clients satisfaits',

            // CTA Footer
            'cta.question.title': 'Une question ?',
            'cta.question.subtitle': 'Contactez-nous pour discuter de votre projet',
            'cta.ready': 'Prêt à',
            'cta.transform': 'transformer',
            'cta.business': 'votre business ?',
            'cta.subtitle': 'Rejoignez les entreprises qui ont boosté leur présence en ligne avec Nexus.',

            // Footer
            'footer.desc': 'Agence web premium spécialisée dans la création de sites web modernes qui maximisent vos revenus.',
            'footer.rights': 'Tous droits réservés.',
            'footer.madeWith': 'Conçu avec',
            'footer.inFrance': 'en France',

            // Common
            'common.learnMore': 'En savoir plus',
            'common.getQuote': 'Demander un devis',
            'common.contact': 'Nous contacter',
            'common.viewProject': 'Voir le projet'
        },
        en: {
            // Navigation
            'nav.home': 'Home',
            'nav.offers': 'Pricing',
            'nav.portfolio': 'Portfolio',
            'nav.testimonials': 'Testimonials',
            'nav.services': 'Services',
            'nav.contact': 'Contact',

            // Hero (Home)
            'hero.badge': 'Premium Creative Agency',
            'hero.title': 'Creating your',
            'hero.title2': 'digital presence',
            'hero.title3': 'of tomorrow',
            'hero.subtitle': 'We design extraordinary web experiences that captivate your visitors and transform your vision into digital reality.',
            'hero.cta': 'Start a project',
            'hero.cta2': 'See our offers',

            // Stats (Home)
            'stat.projects': 'Projects delivered',
            'stat.clients': 'Satisfied clients',
            'stat.experience': 'Experience',
            'stat.support': 'Customer support',

            // Benefits (Home)
            'home.benefits.title': 'Why choose',
            'home.benefits.titleQuestion': '?',
            'home.benefits.subtitle1': 'We don’t just sell you a pretty site.',
            'home.benefits.subtitleStrong': 'We promise you revenue.',
            'home.benefits.subtitle2': 'Our clients generate on average',
            'home.benefits.subtitleGradient': '+40% revenue',
            'home.benefits.subtitleEnd': 'after 6 months.',
            'home.benefits.link': 'See all our services →',

            // Benefit Cards (Home)
            'home.benefit1.title': '+40% Conversions',
            'home.benefit1.desc': 'Every element is optimized to turn visitors into paying customers. No useless decoration, just results.',
            'home.benefit2.title': 'Guaranteed ROI',
            'home.benefit2.desc': 'Your investment must pay off. Our sites are designed to generate sales, not just look good.',
            'home.benefit3.title': 'Business Strategy',
            'home.benefit3.desc': 'We analyze your market, competitors, and customers to create a site that truly sells.',

            // Social Proof (Home)
            'home.proof1.label': 'Generated for our clients',
            'home.proof2.label': 'Average traffic in 3 months',
            'home.proof3.label': 'To see first results',

            // Guarantee (Home)
            'home.guarantee.title': 'Included with your',
            'home.guarantee.subscription': 'subscription',
            'home.guarantee.desc1': 'We don\'t leave you alone after delivery. Your success is our priority.',
            'home.guarantee.descStrong': 'Complete support to maximize your results.',
            'home.guarantee.badge1': '✓ Unlimited Support',
            'home.guarantee.badge2': '✓ Free Optimizations',
            'home.guarantee.badge3': '✓ Regular Updates',
            'home.guarantee.badge4': '✓ Personalized Advice',

            // Pricing Page
            'pricing.badge': '🌐 Websites',
            'pricing.title.start': 'Create your',
            'pricing.title.end': 'Website',
            'pricing.subtitle': 'From showcase sites to full e-commerce stores. Negotiable prices for all budgets.',
            'pricing.app.question': '📱 Looking for an app?',
            'pricing.app.link': 'See our app offers →',
            'pricing.popular': '⭐ Popular',
            'pricing.period.once': 'One-time payment',
            'pricing.period.from': 'Starting from',
            'pricing.negotiable': '💬 Price negotiable based on needs',
            'pricing.trust.label': 'They trust us',
            'pricing.btn.cart': '🛒 Add to cart',
            'pricing.btn.viewCart': '🛒 View my cart',

            // Pricing Cards Features
            'pricing.card1.title': 'Showcase Site',
            'pricing.card1.desc': 'Perfect for presenting your business',
            'pricing.card1.delivery': '⏱️ Delivery: 2 weeks',
            'pricing.card1.feat1': 'Custom design',
            'pricing.card1.feat2': 'Up to 5 pages',
            'pricing.card1.feat3': 'Responsive (mobile, tablet)',
            'pricing.card1.feat4': 'Basic SEO optimization',
            'pricing.card1.feat5': 'Contact form',
            'pricing.card1.feat6': '1 year hosting included',

            'pricing.card2.title': 'E-commerce',
            'pricing.card2.desc': 'Launch your online store',
            'pricing.card2.delivery': '⏱️ Delivery: 4 weeks',
            'pricing.card2.feat1': 'Everything in Showcase plan',
            'pricing.card2.feat2': 'Up to 100 products',
            'pricing.card2.feat3': 'Secure payment (Stripe)',
            'pricing.card2.feat4': 'Inventory management',
            'pricing.card2.feat5': 'Admin dashboard',
            'pricing.card2.feat6': 'Training included',
            'pricing.card2.feat7': '6 months priority support',

            'pricing.card3.title': 'Custom Build',
            'pricing.card3.desc': 'Tailored solution for your needs',
            'pricing.card3.delivery': '⏱️ Delivery: 6+ weeks',
            'pricing.card3.feat1': 'Custom architecture',
            'pricing.card3.feat2': 'Bespoke features',
            'pricing.card3.feat3': 'Third-party API integrations',
            'pricing.card3.feat4': 'Optimized performance',
            'pricing.card3.feat5': 'Dedicated support',
            'pricing.card3.feat6': 'Premium maintenance',
            'pricing.card3.feat7': 'Guaranteed SLA',

            // Portfolio Page
            'portfolio.header.badge': 'Our Work',
            'portfolio.header.title': 'Our Recent',
            'portfolio.header.titleGradient': 'Projects',
            'portfolio.header.subtitle': 'Discover how we helped our clients transform their vision into digital reality.',

            'portfolio.alpha.badge': '⭐ Featured Project',
            'portfolio.alpha.titleSuffix': 'AI Education Platform',
            'portfolio.alpha.subtitle': 'Complete transformation of the online learning experience',
            'portfolio.alpha.cardTitle': 'The Challenge',
            'portfolio.alpha.desc1': 'Alpha Academy wanted to modernize its aging online course platform. The goal was to create an immersive experience, integrating artificial intelligence to personalize learning.',
            'portfolio.alpha.desc2': 'We designed a modern architecture based on React and Node.js, integrating a personalized AI tutor for each student.',
            'portfolio.alpha.stat1': 'AI Tutor',
            'portfolio.alpha.stat2': 'Payments',
            'portfolio.alpha.stat3': 'Analytics',
            'portfolio.alpha.cta': 'View live site',
            'portfolio.alpha.slogan': 'Education reinvented by AI',

            'portfolio.edu.badge': '🚀 E-commerce',
            'portfolio.edu.titleSuffix': 'Course Comparator',
            'portfolio.edu.subtitle': 'An intuitive marketplace for professional training',
            'portfolio.edu.cardTitle': 'The Solution',
            'portfolio.edu.desc1': 'Creation of an intelligent course comparator allowing filtering among thousands of offers. Fluid interface and advanced recommendation system.',
            'portfolio.edu.desc2': 'A 200% increase in conversion rate from the first month thanks to optimized UX.',
            'portfolio.edu.stat1': 'Analytics',
            'portfolio.edu.stat2': 'Real Reviews',
            'portfolio.edu.stat3': 'Success Rate',
            'portfolio.edu.stat4': 'Outcomes',
            'portfolio.edu.partner': 'Official Partner',
            'portfolio.edu.cta': 'View case study',

            'portfolio.client.title': 'Client Projects',
            'portfolio.cat.showcase': 'Showcase',
            'portfolio.cat.ecommerce': 'E-commerce',
            'portfolio.cat.app': 'Application',

            'portfolio.client1.desc': 'Complete overhaul of visual identity and website.',
            'portfolio.client2.desc': 'Online clothing store with virtual try-on.',
            'portfolio.client3.desc': 'Task management application for teams.',
            'portfolio.client4.desc': 'Reservation site for a starred restaurant.',
            'portfolio.client5.desc': 'Real estate platform with virtual tours.',
            'portfolio.client6.desc': 'Sports coaching app with real-time tracking.',

            'portfolio.reservations': 'Reservations',
            'portfolio.sales': 'Sales',
            'portfolio.downloads': 'Downloads',
            'portfolio.calls': 'Calls',
            'portfolio.leads': 'Leads',
            'portfolio.requests': 'Requests',

            'portfolio.more.text': 'And much more...',
            'portfolio.more.btn': 'View all projects',

            // Trust Badges
            'trust.secure.title': '100% Secure Payment',
            'trust.secure.subtitle': '256-bit SSL Encryption',
            'trust.satisfaction.title': 'Satisfaction Guaranteed',
            'trust.satisfaction.subtitle': '30-day money-back guarantee',
            'trust.support.title': 'Responsive Support',
            'trust.support.subtitle': 'Response within 24h',
            'trust.rating.title': '50+ Projects',
            'trust.rating.subtitle': '98% satisfied clients',

            // CTA Footer
            'cta.question.title': 'Any questions?',
            'cta.question.subtitle': 'Contact us to discuss your project',
            'cta.ready': 'Ready to',
            'cta.transform': 'transform',
            'cta.business': 'your business?',
            'cta.subtitle': 'Join the companies that have boosted their online presence with Nexus.',

            // Footer
            'footer.desc': 'Premium web agency specializing in creating modern websites that maximize your revenue.',
            'footer.rights': 'All rights reserved.',
            'footer.madeWith': 'Designed with',
            'footer.inFrance': 'in France',

            // Common
            'common.learnMore': 'Learn more',
            'common.getQuote': 'Get a quote',
            'common.contact': 'Contact us',
            'common.viewProject': 'View project'
        }
    };

    function injectStyles() {
        const styles = `
            .lang-switcher {
                position: fixed;
                top: 100px;
                left: 74px;
                z-index: 9991;
                display: flex;
                background: rgba(15, 15, 20, 0.9);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 30px;
                padding: 4px;
            }

            .lang-btn {
                padding: 8px 14px;
                border: none;
                background: transparent;
                color: #71717a;
                font-size: 13px;
                font-weight: 600;
                cursor: pointer;
                border-radius: 20px;
                transition: all 0.2s;
                font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
            }

            .lang-btn:hover {
                color: white;
            }

            .lang-btn.active {
                background: linear-gradient(135deg, #7c3aed, #db2777);
                color: white;
            }

            @media (max-width: 768px) {
                .lang-switcher {
                    top: auto;
                    bottom: 180px;
                    left: 66px;
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    function getCurrentLang() {
        return localStorage.getItem(CONFIG.storageKey) || CONFIG.defaultLang;
    }

    function setLang(lang) {
        localStorage.setItem(CONFIG.storageKey, lang);
        document.documentElement.lang = lang;
        translatePage(lang);
        updateButtons(lang);
    }

    function translatePage(lang) {
        const translations = TRANSLATIONS[lang];
        if (!translations) return;

        // Translate elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (translations[key]) {
                el.textContent = translations[key];
            }
        });

        // Translate placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.dataset.i18nPlaceholder;
            if (translations[key]) {
                el.placeholder = translations[key];
            }
        });
    }

    function updateButtons(lang) {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
    }

    function createSwitcher() {
        const switcher = document.createElement('div');
        switcher.className = 'lang-switcher';
        switcher.id = 'lang-switcher';

        const currentLang = getCurrentLang();

        switcher.innerHTML = `
            <button class="lang-btn ${currentLang === 'fr' ? 'active' : ''}" 
                data-lang="fr" onclick="window.setLanguage('fr')">🇫🇷 FR</button>
            <button class="lang-btn ${currentLang === 'en' ? 'active' : ''}" 
                data-lang="en" onclick="window.setLanguage('en')">🇬🇧 EN</button>
        `;

        document.body.appendChild(switcher);
    }

    window.setLanguage = function (lang) {
        setLang(lang);
    };

    window.getTranslation = function (key) {
        const lang = getCurrentLang();
        return TRANSLATIONS[lang]?.[key] || key;
    };

    function init() {
        injectStyles();
        createSwitcher();

        // Apply stored language
        const lang = getCurrentLang();
        document.documentElement.lang = lang;
        translatePage(lang);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
