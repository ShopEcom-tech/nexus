/**
 * Spotlight Effect for Cards
 * Adds a glowing gradient that follows the mouse cursor
 */

document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.spotlight-card');

    document.addEventListener('mousemove', (e) => {
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
});
