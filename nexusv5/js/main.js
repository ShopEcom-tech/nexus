
// Main Entry Point
// Imports all major modules

import './config.js'; // Global config
import './script.js'; // General script (to be refactored further)
import './three-effects.js'; // 3D Background
import { initGSAPAnimations } from './gsap-animations.js';
import { initBarbaTransitions } from './page-transitions.js';
import { initSmoothScroll } from './smooth-scroll.js';

// Styles (if we were using CSS imports via Vite, which we could)
// import '../css/style.css'; 

console.log('🚀 Nexus v5 Main Module Loaded');

// Feature Modules
import './3d-cards.js';
import './3d-logo.js';
import './chatbot.js';
import './whatsapp-widget.js';
import './counter-animation.js';
// import './activity-feed.js'; // Disabled
import './cookie-consent.js';
import './typing-effect.js';
import './trust-badges.js';
import './faq-accordion.js';
import './promo-banner.js';
import './exit-intent.js';
import './newsletter-popup.js';
import './testimonials-carousel.js';
import './theme-toggle.js';
import './scroll-reveal.js';
import './sticky-cta.js';
import './visitor-counter.js';
import './reading-progress.js';
import './cart.js';
import './tooltip-system.js';
import './push-notifications.js';
import './confetti.js';
import './lazy-loading.js';
import './keyboard-shortcuts.js';
import './email-service.js';
import './calendly-widget.js';
import './tilt-3d.js';
import './language-switcher.js';

// Init Functions
if (document.readyState !== 'loading') {
    initGSAPAnimations();
    initSmoothScroll();
    initBarbaTransitions();
} else {
    document.addEventListener('DOMContentLoaded', () => {
        initGSAPAnimations();
        initSmoothScroll();
        initBarbaTransitions();
    });
}
