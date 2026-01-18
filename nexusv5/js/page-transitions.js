/**
 * Nexus Page Transitions
 * Powered by Barba.js & GSAP
 */

import barba from '@barba/core';
import gsap from 'gsap';

export function initBarbaTransitions() {
    console.log('🔄 Initializing Barba.js...');

    barba.init({
        debug: true,
        timeout: 5000,
        transitions: [{
            name: 'fade',
            sync: false,
            leave(data) {
                return gsap.to(data.current.container, {
                    opacity: 0,
                    duration: 0.5,
                    onComplete: () => {
                        data.current.container.style.display = 'none';
                    }
                });
            },
            enter(data) {
                gsap.set(data.next.container, { opacity: 0 });
                return gsap.to(data.next.container, {
                    opacity: 1,
                    duration: 0.5,
                    clearProps: "all"
                });
            }
        }],
        views: []
    });

    // Hooks
    barba.hooks.after((data) => {
        // 1. Re-init GSAP Animations
        if (window.initGSAPAnimations) {
            window.initGSAPAnimations();
        } else {
            // Try to import dynamically or check if module exposed it? 
            // We attached it to window in gsap-animations.js for this exact reason.
        }

        // 2. Scroll to top
        if (window.lenis) {
            window.lenis.resize();
            window.lenis.scrollTo(0, { immediate: true });
        } else {
            window.scrollTo(0, 0);
        }

        // 3. Update Active Nav Link
        const path = data.next.url.path;
        document.querySelectorAll('.navbar-link, .mobile-menu-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === path || link.href.endsWith(path)) {
                link.classList.add('active');
            }
        });
    });
}
