
/**
 * Navbar Interactions (Scroll effect, Mobile Menu, Active Links)
 */
export function initNavbar() {
    // ========================================
    // NAVBAR SCROLL EFFECT
    // ========================================
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // ========================================
    // MOBILE MENU
    // ========================================
    const navbarToggle = document.querySelector('.navbar-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');

    if (navbarToggle && mobileMenu && mobileMenuOverlay) {
        navbarToggle.addEventListener('click', function () {
            navbarToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            mobileMenuOverlay.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        mobileMenuOverlay.addEventListener('click', function () {
            navbarToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // ========================================
    // ACTIVE NAV LINK
    // ========================================
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.navbar-link, .mobile-menu-link').forEach(link => {
        const href = link.getAttribute('href');
        // Handle root path or exact match
        if (href === currentPage || (currentPage === '' && href === 'index.html') || (currentPage === 'index.html' && href === './') || (currentPage === 'index.html' && href === '/')) {
            link.classList.add('active');
        } else {
            // Optional: handle sub-pages if necessary, but keep it simple for now
            link.classList.remove('active');
        }
    });
}
