/**
 * Typing Effect Widget
 * Innovation #13: Typewriter effect for hero titles
 */

(function () {
    'use strict';

    const CONFIG = {
        words: ['présence digitale', 'site web', 'e-commerce', 'identité visuelle'],
        typeSpeed: 100,
        deleteSpeed: 50,
        pauseAfterWord: 2000,
        pauseAfterDelete: 500,
        targetSelector: '.hero-title .text-gradient'
    };

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function injectStyles() {
        const styles = `
            .typing-cursor {
                display: inline-block;
                width: 3px;
                height: 1em;
                background: linear-gradient(135deg, #7c3aed, #db2777);
                margin-left: 4px;
                animation: blink 0.7s infinite;
                vertical-align: text-bottom;
            }

            @keyframes blink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0; }
            }

            .typing-word {
                display: inline;
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    function init() {
        const target = document.querySelector(CONFIG.targetSelector);
        if (!target) return;

        injectStyles();

        // Save original text and replace with typing container
        target.innerHTML = `<span class="typing-word"></span><span class="typing-cursor"></span>`;

        const typingWord = target.querySelector('.typing-word');
        if (!typingWord) return;

        function type() {
            const currentWord = CONFIG.words[wordIndex];

            if (isDeleting) {
                // Deleting
                charIndex--;
                typingWord.textContent = currentWord.substring(0, charIndex);

                if (charIndex === 0) {
                    isDeleting = false;
                    wordIndex = (wordIndex + 1) % CONFIG.words.length;
                    setTimeout(type, CONFIG.pauseAfterDelete);
                } else {
                    setTimeout(type, CONFIG.deleteSpeed);
                }
            } else {
                // Typing
                charIndex++;
                typingWord.textContent = currentWord.substring(0, charIndex);

                if (charIndex === currentWord.length) {
                    isDeleting = true;
                    setTimeout(type, CONFIG.pauseAfterWord);
                } else {
                    setTimeout(type, CONFIG.typeSpeed);
                }
            }
        }

        // Start typing with a delay
        setTimeout(type, 1000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
