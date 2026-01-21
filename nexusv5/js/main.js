
// Main Entry Point
// Imports all major modules

import './config.js'; // Global config

// New Modular Imports
import { initParticles } from './features/particle-canvas.js';
import { initNavbar } from './components/navbar.js';
import { initScrollObserver } from './features/scroll-observer.js';
import { initContactForm } from './features/contact-form.js';
import { initUIInteractions } from './utils/ui-interactions.js';
import { initSimpleTestimonials } from './components/simple-testimonials.js';

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
import './typewriter.js';
import './command-palette.js';
import './trust-badges.js';
import './contact-form.js';
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
import './supabase.js';
import './auth.js';
import './spotlight.js';
import './liquid-distortion.js';
import './quiz-widget.js';
import './language-switcher.js';

// Init Functions
function initApp() {
    initGSAPAnimations();
    initSmoothScroll();
    initBarbaTransitions();

    // New modules initialization
    initParticles();
    initNavbar();
    initScrollObserver();
    initContactForm();
    initUIInteractions();
    initSimpleTestimonials();
}

if (document.readyState !== 'loading') {
    initApp();
} else {
    document.addEventListener('DOMContentLoaded', initApp);
}
