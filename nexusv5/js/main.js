
// Main Entry Point
// Imports all major modules

import './config.js'; // Global config

// New Modular Imports
// import { initParticles } from './features/particle-canvas.js'; // Disabled for performance (Redundant with WASM)
import { initNavbar } from './components/navbar.js';
import { initScrollObserver } from './features/scroll-observer.js';
import { initContactForm } from './features/contact-form.js';
import { initUIInteractions } from './utils/ui-interactions.js';
import { initSimpleTestimonials } from './components/simple-testimonials.js';
import { initThemeSwitcher } from './components/theme-switcher.js';
import { initCounters } from './counter-animation.js';

import { initThreeBackground } from './three-effects.js'; // 3D Background (Persistent)
import { initLiquidDistortion, destroyLiquidDistortion } from './liquid-distortion.js'; // Page specific (Lifecycle managed)
import { initGSAPAnimations } from './gsap-animations.js';
import { initBarbaTransitions } from './page-transitions.js';
import { initSmoothScroll } from './smooth-scroll.js';

import barba from '@barba/core';

// Styles
// import '../css/style.css'; 

console.log('🚀 Nexus v5 Main Module Loaded');

// Feature Modules
import './3d-cards.js';
import './3d-logo.js';
import './chatbot.js';
import './whatsapp-widget.js';
// import './counter-animation.js'; 
// import './activity-feed.js'; 
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
import './quiz-widget.js';
import './language-switcher.js';

// Init Global Features (Run once)
function initGlobalFeatures() {
    initThemeSwitcher(); // First for FOUC
    initSmoothScroll();
    initBarbaTransitions();
    initThreeBackground();
    initNavbar(); // Header is persistent
}

// Init Page specific Features (Run every navigation)
function initPageFeatures() {
    initCounters();
    initScrollObserver();
    try { initContactForm(); } catch (e) { console.warn('Contact form not found'); }
    initUIInteractions();
    initSimpleTestimonials();
    initLiquidDistortion(); // Re-init liquid effects on new images
    initGSAPAnimations(); // Re-trigger GSAP setup
}

// Main Init Function
function initApp() {
    initGlobalFeatures();
    initPageFeatures();

    // Barba Hooks for Lifecycle Management
    barba.hooks.beforeLeave(() => {
        destroyLiquidDistortion();
    });

    barba.hooks.afterEnter(() => {
        initPageFeatures();
    });
}

if (document.readyState !== 'loading') {
    initApp();
} else {
    document.addEventListener('DOMContentLoaded', initApp);
}
