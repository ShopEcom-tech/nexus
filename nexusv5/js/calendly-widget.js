/**
 * Calendly Integration
 * Widget de prise de rendez-vous avec Calendly
 */

(function () {
    'use strict';

    // Configuration Calendly
    const CALENDLY_CONFIG = {
        // URL Calendly
        url: 'https://calendly.com/ecommshoppp13/30min',

        // Couleurs pour matcher le thème du site
        primaryColor: '7c3aed',
        textColor: 'ffffff',
        backgroundColor: '0f0f15'
    };

    /**
     * Charger le script Calendly
     */
    function loadCalendlyScript() {
        return new Promise((resolve, reject) => {
            if (window.Calendly) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://assets.calendly.com/assets/external/widget.js';
            script.async = true;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);

            // CSS Calendly
            const link = document.createElement('link');
            link.href = 'https://assets.calendly.com/assets/external/widget.css';
            link.rel = 'stylesheet';
            document.head.appendChild(link);
        });
    }

    /**
     * Créer un bouton de RDV stylisé
     */
    function createBookingButton(options = {}) {
        const {
            text = '📅 Réserver un appel',
            containerId = null,
            className = 'calendly-booking-btn'
        } = options;

        const button = document.createElement('button');
        button.className = `btn btn-primary ${className}`;
        button.innerHTML = text;
        button.style.cssText = `
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 14px 28px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
        `;

        button.addEventListener('click', () => {
            openCalendlyPopup();
        });

        if (containerId) {
            const container = document.getElementById(containerId);
            if (container) {
                container.appendChild(button);
            }
        }

        return button;
    }

    /**
     * Ouvrir le popup Calendly
     */
    async function openCalendlyPopup(customUrl = null) {
        await loadCalendlyScript();

        const url = customUrl || CALENDLY_CONFIG.url;

        if (url.includes('YOUR_USERNAME')) {
            console.warn('⚠️ Calendly URL non configurée. Configuration requise dans calendly-widget.js');
            alert('La prise de rendez-vous sera bientôt disponible !');
            return;
        }

        window.Calendly.initPopupWidget({
            url: `${url}?hide_gdpr_banner=1&primary_color=${CALENDLY_CONFIG.primaryColor}&text_color=${CALENDLY_CONFIG.textColor}&background_color=${CALENDLY_CONFIG.backgroundColor}`,
            prefill: getPrefillData()
        });
    }

    /**
     * Intégrer Calendly inline dans un conteneur
     */
    async function embedCalendly(containerId, options = {}) {
        await loadCalendlyScript();

        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container #${containerId} non trouvé`);
            return;
        }

        const url = options.url || CALENDLY_CONFIG.url;

        if (url.includes('YOUR_USERNAME')) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; background: rgba(124, 58, 237, 0.1); border-radius: 16px; border: 1px dashed #7c3aed;">
                    <p style="color: #a1a1aa; margin-bottom: 16px;">📅 La prise de rendez-vous sera bientôt disponible !</p>
                    <p style="color: #71717a; font-size: 14px;">En attendant, contactez-nous par email.</p>
                </div>
            `;
            return;
        }

        window.Calendly.initInlineWidget({
            url: `${url}?hide_gdpr_banner=1&primary_color=${CALENDLY_CONFIG.primaryColor}&text_color=${CALENDLY_CONFIG.textColor}&background_color=${CALENDLY_CONFIG.backgroundColor}`,
            parentElement: container,
            prefill: getPrefillData()
        });

        // Style du conteneur
        container.style.minWidth = '320px';
        container.style.height = options.height || '700px';
    }

    /**
     * Récupérer les données pré-remplies (si l'utilisateur est connecté)
     */
    function getPrefillData() {
        const prefill = {};

        // Essayer de récupérer les infos utilisateur depuis Supabase
        if (window.supabaseClient) {
            const session = window.supabaseClient.auth.getSession();
            if (session?.data?.user) {
                const user = session.data.user;
                prefill.email = user.email;
                prefill.name = user.user_metadata?.full_name || '';
            }
        }

        // Ou depuis le localStorage
        const savedCustomer = localStorage.getItem('customer_info');
        if (savedCustomer) {
            try {
                const customer = JSON.parse(savedCustomer);
                prefill.email = prefill.email || customer.email;
                prefill.name = prefill.name || `${customer.firstName} ${customer.lastName}`;
            } catch (e) { }
        }

        return prefill;
    }

    /**
     * Écouter les événements Calendly
     */
    function initEventListeners() {
        window.addEventListener('message', (e) => {
            if (e.origin === 'https://calendly.com') {
                if (e.data.event === 'calendly.event_scheduled') {
                    console.log('✅ RDV réservé:', e.data.payload);

                    // Déclencher un événement personnalisé
                    document.dispatchEvent(new CustomEvent('calendlyBooked', {
                        detail: e.data.payload
                    }));

                    // Afficher un message de confirmation
                    showBookingConfirmation(e.data.payload);
                }
            }
        });
    }

    /**
     * Afficher une confirmation de réservation
     */
    function showBookingConfirmation(payload) {
        // Créer une notification toast
        const toast = document.createElement('div');
        toast.className = 'calendly-confirmation-toast';
        toast.innerHTML = `
            <div style="
                position: fixed;
                bottom: 30px;
                right: 30px;
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
                padding: 20px 30px;
                border-radius: 16px;
                box-shadow: 0 10px 40px rgba(16, 185, 129, 0.3);
                z-index: 99999;
                animation: slideIn 0.3s ease;
            ">
                <p style="margin: 0; font-weight: 600; font-size: 16px;">✅ Rendez-vous confirmé !</p>
                <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Vous recevrez un email de confirmation.</p>
            </div>
        `;

        document.body.appendChild(toast);

        // Retirer après 5 secondes
        setTimeout(() => {
            toast.remove();
        }, 5000);
    }

    /**
     * Initialisation
     */
    function init() {
        initEventListeners();

        // Auto-embed si un conteneur existe
        const autoEmbed = document.getElementById('calendly-embed');
        if (autoEmbed) {
            embedCalendly('calendly-embed');
        }

        // Auto-créer les boutons
        document.querySelectorAll('[data-calendly-button]').forEach(container => {
            const text = container.dataset.calendlyText || '📅 Réserver un appel';
            const button = createBookingButton({ text });
            container.appendChild(button);
        });
    }

    // Exposer les fonctions
    window.CalendlyWidget = {
        open: openCalendlyPopup,
        embed: embedCalendly,
        createButton: createBookingButton,

        // Configuration
        setUrl: (url) => {
            CALENDLY_CONFIG.url = url;
        },
        setColors: (primary, text, bg) => {
            CALENDLY_CONFIG.primaryColor = primary.replace('#', '');
            CALENDLY_CONFIG.textColor = text.replace('#', '');
            CALENDLY_CONFIG.backgroundColor = bg.replace('#', '');
        }
    };

    // Initialiser au chargement
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    console.log('📅 Calendly Widget chargé');

})();
