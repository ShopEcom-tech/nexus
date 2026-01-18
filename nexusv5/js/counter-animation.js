/**
 * Animated Counters Widget
 * Innovation #7: Animates numbers from 0 to target value
 * Uses Intersection Observer for performance
 */

(function () {
    'use strict';

    const COUNTER_CONFIG = {
        duration: 2000, // Animation duration in ms
        easing: 'easeOutExpo', // Animation easing
        triggerOnce: true // Only animate once
    };

    // Easing functions
    const easings = {
        linear: t => t,
        easeOutExpo: t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
        easeOutQuad: t => 1 - (1 - t) * (1 - t),
        easeOutCubic: t => 1 - Math.pow(1 - t, 3)
    };

    function animateCounter(element) {
        const target = parseInt(element.dataset.counter, 10);
        const suffix = element.dataset.suffix || '';
        const duration = COUNTER_CONFIG.duration;
        const easing = easings[COUNTER_CONFIG.easing] || easings.easeOutExpo;

        if (isNaN(target)) return;

        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easing(progress);
            const currentValue = Math.round(easedProgress * target);

            element.textContent = currentValue + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    function initCounters() {
        const counters = document.querySelectorAll('[data-counter]');

        if (counters.length === 0) return;

        // Check if Intersection Observer is supported
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        if (COUNTER_CONFIG.triggerOnce) {
                            observer.unobserve(entry.target);
                        }
                    }
                });
            }, {
                threshold: 0.5,
                rootMargin: '0px'
            });

            counters.forEach(counter => observer.observe(counter));
        } else {
            // Fallback: animate immediately
            counters.forEach(counter => animateCounter(counter));
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCounters);
    } else {
        initCounters();
    }
})();
