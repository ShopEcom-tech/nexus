/**
 * Scroll Observer for animations
 */
export function initScrollObserver() {
    // ========================================
    // SCROLL ANIMATIONS
    // ========================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.classList.add('scroll-animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements
    // Added new selectors for testimonials page
    const selectors = [
        '.card',
        '.benefit-card',
        '.service-card',
        '.pricing-card',
        '.process-card',
        '.testimonial-stat',
        '.featured-testimonial',
        '.result-card',
        '.premium-testimonial-card',
        '.hero-trust-item',
        '.video-card',
        '.cta-premium'
    ];

    document.querySelectorAll(selectors.join(', ')).forEach(el => {
        el.classList.add('scroll-animate-init');
        observer.observe(el);
    });

    // Clean up: Removed the scroll event listener that was forcing styles inline

    // Trigger initial check for already visible elements
    setTimeout(function () {
        document.querySelectorAll('.scroll-animate-init').forEach(el => {
            // Check visibility manually if needed, or let observer handle it
            // This timeout just ensures DOM is ready
        });
    }, 100);
}
