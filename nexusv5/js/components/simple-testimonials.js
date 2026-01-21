
/**
 * Simple Testimonials Carousel
 */
export function initSimpleTestimonials() {
    // ========================================
    // TESTIMONIALS CAROUSEL
    // ========================================
    const testimonials = document.querySelectorAll('.testimonial-slide');
    const testimonialDots = document.querySelectorAll('.testimonial-dot');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    let currentTestimonial = 0;

    function showTestimonial(index) {
        testimonials.forEach((t, i) => {
            t.style.display = i === index ? 'block' : 'none';
        });
        testimonialDots.forEach((d, i) => {
            d.classList.toggle('active', i === index);
        });
    }

    if (testimonials.length > 0) {
        showTestimonial(0);

        if (prevBtn) {
            prevBtn.addEventListener('click', function () {
                currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
                showTestimonial(currentTestimonial);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', function () {
                currentTestimonial = (currentTestimonial + 1) % testimonials.length;
                showTestimonial(currentTestimonial);
            });
        }

        testimonialDots.forEach((dot, index) => {
            dot.addEventListener('click', function () {
                currentTestimonial = index;
                showTestimonial(currentTestimonial);
            });
        });
    }
}
