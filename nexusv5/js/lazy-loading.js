/**
 * Image Lazy Loading
 * Innovation #28: Performance optimized image loading
 */

(function () {
    'use strict';

    const CONFIG = {
        rootMargin: '50px 0px',
        threshold: 0.01,
        placeholderColor: 'rgba(124, 58, 237, 0.1)'
    };

    function injectStyles() {
        const styles = `
            .lazy-image {
                opacity: 0;
                transition: opacity 0.5s ease;
                background: ${CONFIG.placeholderColor};
            }

            .lazy-image.loaded {
                opacity: 1;
                background: transparent;
            }

            .lazy-placeholder {
                position: relative;
                overflow: hidden;
                background: ${CONFIG.placeholderColor};
            }

            .lazy-placeholder::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(
                    90deg,
                    transparent,
                    rgba(255, 255, 255, 0.1),
                    transparent
                );
                animation: shimmer 1.5s infinite;
            }

            @keyframes shimmer {
                100% { left: 100%; }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    function loadImage(img) {
        const src = img.dataset.src || img.dataset.lazySrc;

        if (!src) return;

        // Create temp image to preload
        const tempImg = new Image();

        tempImg.onload = function () {
            img.src = src;
            img.classList.add('loaded');
            img.classList.remove('lazy-placeholder');

            // Also load srcset if available
            if (img.dataset.srcset) {
                img.srcset = img.dataset.srcset;
            }
        };

        tempImg.onerror = function () {
            console.warn('Failed to load image:', src);
            img.classList.add('loaded');
        };

        tempImg.src = src;
    }

    function initLazyLoading() {
        // Find all images with data-src attribute
        const lazyImages = document.querySelectorAll('img[data-src], img[data-lazy-src]');

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        loadImage(img);
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: CONFIG.rootMargin,
                threshold: CONFIG.threshold
            });

            lazyImages.forEach(img => {
                img.classList.add('lazy-image', 'lazy-placeholder');
                imageObserver.observe(img);
            });
        } else {
            // Fallback: load all images immediately
            lazyImages.forEach(loadImage);
        }
    }

    // Helper function to convert existing images to lazy
    window.makeLazy = function (selector) {
        const images = document.querySelectorAll(selector || 'img:not(.lazy-image)');

        images.forEach(img => {
            if (img.src && !img.dataset.src) {
                img.dataset.src = img.src;
                img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
                img.classList.add('lazy-image', 'lazy-placeholder');
            }
        });

        initLazyLoading();
    };

    function init() {
        injectStyles();
        initLazyLoading();

        // Native lazy loading support
        if ('loading' in HTMLImageElement.prototype) {
            document.querySelectorAll('img:not([loading])').forEach(img => {
                img.loading = 'lazy';
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
