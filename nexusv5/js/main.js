
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

// Ensure GSAP bits run if not auto-run
if (document.readyState !== 'loading') {
    initGSAPAnimations();
    initSmoothScroll();
    initBarbaTransitions();
}
// Listen for DOMContentLoaded usually handled by module defer, but safe to add:
document.addEventListener('DOMContentLoaded', () => {
    // Already calling initGSAPAnimations inside its file if loading
    initSmoothScroll();
    initBarbaTransitions();
});
