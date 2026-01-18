class Typewriter {
    constructor(element, phrases, waitTime = 3000) {
        this.element = element;
        this.phrases = phrases;
        this.waitTime = waitTime;
        this.currentPhraseIndex = 0;
        this.currentText = '';
        this.isDeleting = false;
        this.isWaiting = false;

        // Inject CSS for cursor
        this.injectStyles();

        this.tick();
    }

    injectStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
            .typewriter-cursor {
                display: inline-block;
                width: 3px;
                background-color: #ec4899;
                animation: blink 1s infinite;
                margin-left: 2px;
                vertical-align: middle;
                height: 1em;
            }
            @keyframes blink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    tick() {
        const fullPhrase = this.phrases[this.currentPhraseIndex];

        if (this.isDeleting) {
            // Delete char
            this.currentText = fullPhrase.substring(0, this.currentText.length - 1);
        } else {
            // Add char
            this.currentText = fullPhrase.substring(0, this.currentText.length + 1);
        }

        this.element.innerHTML = `<span class="text-gradient">${this.currentText}</span>`;

        let typeSpeed = 100;

        if (this.isDeleting) {
            typeSpeed /= 2; // Delete faster
        }

        if (!this.isDeleting && this.currentText === fullPhrase) {
            // Finished typing
            typeSpeed = this.waitTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentText === '') {
            // Finished deleting
            this.isDeleting = false;
            this.currentPhraseIndex = (this.currentPhraseIndex + 1) % this.phrases.length;
            typeSpeed = 500;
        }

        setTimeout(() => this.tick(), typeSpeed);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const typeTarget = document.getElementById('typewriter-target');
    if (typeTarget) {
        new Typewriter(typeTarget, [
            "présence digitale de demain",
            "future boutique en ligne",
            "identité visuelle unique",
            "stratégie web gagnante",
            "croissance exponentielle"
        ]);

        // Add cursor separately to avoid gradient issue on cursor
        const cursor = document.createElement('span');
        cursor.className = 'typewriter-cursor';
        typeTarget.parentNode.appendChild(cursor); // Append to parent (h1)
    }
});
