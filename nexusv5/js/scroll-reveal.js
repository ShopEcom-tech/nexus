/**
 * Scroll Reveal Animations
 * Innovation #21: Animate elements as they enter viewport
 */

(function () {
    'use strict';

    const CONFIG = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px',
        animationClass: 'reveal-visible'
    };

    function injectStyles() {
        const styles = `
            .reveal {
                opacity: 0;
                transform: translateY(40px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }

            .reveal.reveal-visible {
                opacity: 1;
                transform: translateY(0);
            }

            .reveal-left {
                opacity: 0;
                transform: translateX(-50px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }

            .reveal-left.reveal-visible {
                opacity: 1;
                transform: translateX(0);
            }

            .reveal-right {
                opacity: 0;
                transform: translateX(50px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }

            .reveal-right.reveal-visible {
                opacity: 1;
                transform: translateX(0);
            }

            .reveal-scale {
                opacity: 0;
                transform: scale(0.9);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }

            .reveal-scale.reveal-visible {
                opacity: 1;
                transform: scale(1);
            }

            /* Stagger delays for grid items */
            .reveal-stagger > *:nth-child(1) { transition-delay: 0.1s; }
            .reveal-stagger > *:nth-child(2) { transition-delay: 0.2s; }
            .reveal-stagger > *:nth-child(3) { transition-delay: 0.3s; }
            .reveal-stagger > *:nth-child(4) { transition-delay: 0.4s; }
            .reveal-stagger > *:nth-child(5) { transition-delay: 0.5s; }
            .reveal-stagger > *:nth-child(6) { transition-delay: 0.6s; }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    function addRevealClasses() {
        // Add reveal class to various elements
        const selectors = [
            '.section-header',
            '.card',
            '.benefit-card',
            '.service-card',
            '.pricing-card',
            '.hero-stat',
            '.faq-item'
        ];

        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                if (!el.classList.contains('reveal')) {
                    el.classList.add('reveal');
                }
            });
        });

        // Add stagger to grids
        document.querySelectorAll('.benefits-grid, .services-grid, .pricing-grid, .portfolio-grid').forEach(grid => {
            grid.classList.add('reveal-stagger');
        });
    }

    function initObserver() {
        const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add(CONFIG.animationClass);
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: CONFIG.threshold,
                rootMargin: CONFIG.rootMargin
            });

            reveals.forEach(el => observer.observe(el));
        } else {
            // Fallback: show all
            reveals.forEach(el => el.classList.add(CONFIG.animationClass));
        }
    }

    function init() {
        injectStyles();
        addRevealClasses();

        // Small delay to ensure DOM is ready
        setTimeout(initObserver, 100);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
