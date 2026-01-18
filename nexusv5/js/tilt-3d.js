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
            if (!bounds) bounds = card.getBoundingClientRect();

            const mouseX = e.clientX;
            const mouseY = e.clientY;
            const leftX = mouseX - bounds.x;
            const topY = mouseY - bounds.y;
            const center = {
                x: leftX - bounds.width / 2,
                y: topY - bounds.height / 2
            };

            // Apply Transform - Scale only, no rotation
            card.style.transform = 'scale3d(1.02, 1.02, 1.02)';
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
