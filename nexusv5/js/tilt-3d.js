/**
 * Nexus v5 - 3D Tilt Effect
 * 
 * Ajoute un effet de profondeur 3D interactif aux cartes.
 * Léger, performant (rAF) et sans dépendance lourde.
 */

class TiltEffect {
    constructor() {
        this.cards = document.querySelectorAll('.card, .pricing-card, .benefit-card, [data-tilt]');
        this.init();
    }

    init() {
        if (!this.cards.length) return;

        this.cards.forEach(card => {
            this.addListeners(card);
        });
    }

    addListeners(card) {
        let bounds;

        const onMouseEnter = () => {
            bounds = card.getBoundingClientRect();
            card.style.transition = 'none';
        };

        const onMouseMove = (e) => {
            // JS Tilt disabled - rely on CSS
        };

        const onMouseLeave = () => {
            card.style.transition = 'transform 0.5s ease-out';
            card.style.transform = 'scale3d(1, 1, 1)';
        };

        card.addEventListener('mouseenter', onMouseEnter);
        card.addEventListener('mousemove', onMouseMove);
        card.addEventListener('mouseleave', onMouseLeave);
    }
}

// Initialiser au chargement et après transition Barba
document.addEventListener('DOMContentLoaded', () => {
    window.NexusTilt = new TiltEffect();
    console.log('🧊 3D Tilt Effect Initialized');
});
