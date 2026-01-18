/**
 * Testimonial Carousel
 * Innovation #19: Auto-rotating testimonials slider
 */

(function () {
    'use strict';

    const TESTIMONIALS = [
        {
            name: 'Sophie Martin',
            role: 'Fondatrice, RestauChic',
            avatar: '👩‍💼',
            rating: 5,
            text: 'Notre site a transformé notre business ! Les réservations ont augmenté de 200% en 3 mois. L\'équipe Nexus est exceptionnelle.'
        },
        {
            name: 'Thomas Dubois',
            role: 'CEO, TechStart',
            avatar: '👨‍💻',
            rating: 5,
            text: 'Un travail remarquable. Le site est rapide, moderne et nos clients adorent. Je recommande à 100%.'
        },
        {
            name: 'Marie Laurent',
            role: 'Directrice, MediCare Pro',
            avatar: '👩‍⚕️',
            rating: 5,
            text: 'Professionnalisme et créativité au rendez-vous. Notre présence en ligne n\'a jamais été aussi forte.'
        },
        {
            name: 'Lucas Bernard',
            role: 'Fondateur, E-Shop Plus',
            avatar: '🧑‍💼',
            rating: 5,
            text: 'Les ventes ont explosé depuis le lancement. Meilleur investissement de l\'année pour notre entreprise.'
        }
    ];

    const CONFIG = {
        autoRotate: true,
        interval: 5000, // 5 seconds
        showOnPages: ['index', 'temoignages']
    };

    let currentIndex = 0;
    let intervalId = null;

    function injectStyles() {
        const styles = `
            .testimonial-carousel {
                position: relative;
                max-width: 600px;
                margin: 0 auto;
                padding: 40px 20px;
            }

            .testimonial-slide {
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-radius: 20px;
                padding: 32px;
                text-align: center;
                opacity: 0;
                transform: translateX(50px);
                transition: all 0.5s ease;
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
            }

            .testimonial-slide.active {
                opacity: 1;
                transform: translateX(0);
                position: relative;
            }

            .testimonial-slide.prev {
                opacity: 0;
                transform: translateX(-50px);
            }

            .testimonial-avatar {
                width: 70px;
                height: 70px;
                background: linear-gradient(135deg, #7c3aed, #db2777);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 32px;
                margin: 0 auto 16px;
            }

            .testimonial-rating {
                color: #fbbf24;
                font-size: 18px;
                margin-bottom: 16px;
                letter-spacing: 2px;
            }

            .testimonial-text {
                color: #e4e4e7;
                font-size: 16px;
                line-height: 1.8;
                font-style: italic;
                margin-bottom: 20px;
            }

            .testimonial-text::before,
            .testimonial-text::after {
                content: '"';
                color: #7c3aed;
                font-size: 24px;
            }

            .testimonial-name {
                color: white;
                font-size: 16px;
                font-weight: 600;
            }

            .testimonial-role {
                color: #71717a;
                font-size: 14px;
            }

            .testimonial-dots {
                display: flex;
                justify-content: center;
                gap: 8px;
                margin-top: 24px;
            }

            .testimonial-dot {
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.2);
                border: none;
                cursor: pointer;
                transition: all 0.3s;
            }

            .testimonial-dot.active {
                background: linear-gradient(135deg, #7c3aed, #db2777);
                transform: scale(1.2);
            }

            .testimonial-arrows {
                position: absolute;
                top: 50%;
                left: 0;
                right: 0;
                transform: translateY(-50%);
                display: flex;
                justify-content: space-between;
                pointer-events: none;
                padding: 0 -20px;
            }

            .testimonial-arrow {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                color: white;
                font-size: 18px;
                cursor: pointer;
                transition: all 0.3s;
                pointer-events: auto;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .testimonial-arrow:hover {
                background: rgba(124, 58, 237, 0.3);
                border-color: #7c3aed;
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    function renderStars(count) {
        return '★'.repeat(count) + '☆'.repeat(5 - count);
    }

    function createCarousel() {
        // Find testimonials section or create container
        const section = document.querySelector('.testimonials-grid, #testimonials');
        if (!section) return;

        // Replace grid with carousel
        const carousel = document.createElement('div');
        carousel.className = 'testimonial-carousel';
        carousel.id = 'testimonial-carousel';

        carousel.innerHTML = `
            ${TESTIMONIALS.map((t, i) => `
                <div class="testimonial-slide ${i === 0 ? 'active' : ''}" data-index="${i}">
                    <div class="testimonial-avatar">${t.avatar}</div>
                    <div class="testimonial-rating">${renderStars(t.rating)}</div>
                    <p class="testimonial-text">${t.text}</p>
                    <div class="testimonial-name">${t.name}</div>
                    <div class="testimonial-role">${t.role}</div>
                </div>
            `).join('')}
            
            <div class="testimonial-dots">
                ${TESTIMONIALS.map((_, i) => `
                    <button class="testimonial-dot ${i === 0 ? 'active' : ''}" 
                        data-index="${i}" onclick="window.goToTestimonial(${i})"></button>
                `).join('')}
            </div>
        `;

        section.parentNode.insertBefore(carousel, section);
        section.style.display = 'none';

        if (CONFIG.autoRotate) {
            startAutoRotate();
        }
    }

    function updateSlide(newIndex) {
        const slides = document.querySelectorAll('.testimonial-slide');
        const dots = document.querySelectorAll('.testimonial-dot');

        slides.forEach((slide, i) => {
            slide.classList.remove('active', 'prev');
            if (i === newIndex) {
                slide.classList.add('active');
            } else if (i === currentIndex) {
                slide.classList.add('prev');
            }
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === newIndex);
        });

        currentIndex = newIndex;
    }

    function startAutoRotate() {
        intervalId = setInterval(() => {
            const nextIndex = (currentIndex + 1) % TESTIMONIALS.length;
            updateSlide(nextIndex);
        }, CONFIG.interval);
    }

    window.goToTestimonial = function (index) {
        clearInterval(intervalId);
        updateSlide(index);
        if (CONFIG.autoRotate) {
            startAutoRotate();
        }
    };

    function shouldShowOnCurrentPage() {
        const path = window.location.pathname.toLowerCase();
        return CONFIG.showOnPages.some(page =>
            path.includes(page) || path === '/' || path.endsWith('/index.html')
        );
    }

    function init() {
        if (!shouldShowOnCurrentPage()) return;

        injectStyles();

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createCarousel);
        } else {
            createCarousel();
        }
    }

    init();
})();
