
/**
 * General UI Interactions (Buttons, Smooth Scroll anchors)
 */
export function initUIInteractions() {
    // ========================================
    // BUTTON HOVER EFFECTS
    // ========================================
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', function (e) {
            this.style.transform = 'translateY(-2px)';
        });
        btn.addEventListener('mouseleave', function (e) {
            this.style.transform = 'translateY(0)';
        });
    });

    // ========================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}
