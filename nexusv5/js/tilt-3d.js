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

            // Add glare element if not present
            if (!card.querySelector('.tilt-glare')) {
                const glare = document.createElement('div');
                glare.classList.add('tilt-glare');
                Object.assign(glare.style, {
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    borderRadius: 'inherit',
                    background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15), transparent 60%)',
                    opacity: '0',
                    pointerEvents: 'none',
                    mixBlendMode: 'overlay',
                    transition: 'opacity 0.3s ease',
                    zIndex: '2'
                });
                card.appendChild(glare);
            }
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
            const distance = Math.sqrt(center.x ** 2 + center.y ** 2);

            // Rotation Logic
            const maxRotation = 10; // degrees
            const rotateX = ((center.y / bounds.height) * -maxRotation).toFixed(2);
            const rotateY = ((center.x / bounds.width) * maxRotation).toFixed(2);

            // Glare Logic
            const glare = card.querySelector('.tilt-glare');
            if (glare) {
                glare.style.transform = `translate(${center.x}px, ${center.y}px)`;
                glare.style.opacity = '1';
            }

            // Apply Transform
            card.style.transform = `
                perspective(1000px) 
                scale3d(1.02, 1.02, 1.02)
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg)
            `;
        };

        const onMouseLeave = () => {
            card.style.transition = 'transform 0.5s ease-out';
            card.style.transform = `
                perspective(1000px) 
                scale3d(1, 1, 1) 
                rotateX(0deg) 
                rotateY(0deg)
            `;

            const glare = card.querySelector('.tilt-glare');
            if (glare) {
                glare.style.opacity = '0';
            }
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
