/**
 * Smart Tooltip System
 * Innovation #25: Contextual tooltips for better UX
 */

(function () {
    'use strict';

    function injectStyles() {
        const styles = `
            [data-tooltip] {
                position: relative;
                cursor: help;
            }

            [data-tooltip]::before,
            [data-tooltip]::after {
                position: absolute;
                opacity: 0;
                visibility: hidden;
                transition: all 0.2s ease;
                pointer-events: none;
                z-index: 99999;
            }

            /* Tooltip bubble */
            [data-tooltip]::after {
                content: attr(data-tooltip);
                bottom: calc(100% + 10px);
                left: 50%;
                transform: translateX(-50%) translateY(5px);
                background: rgba(15, 15, 20, 0.95);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(124, 58, 237, 0.3);
                color: white;
                padding: 10px 14px;
                border-radius: 10px;
                font-size: 13px;
                font-weight: 500;
                white-space: nowrap;
                max-width: 250px;
                text-align: center;
                line-height: 1.4;
            }

            /* Arrow */
            [data-tooltip]::before {
                content: '';
                bottom: calc(100% + 4px);
                left: 50%;
                transform: translateX(-50%);
                border: 6px solid transparent;
                border-top-color: rgba(15, 15, 20, 0.95);
            }

            [data-tooltip]:hover::before,
            [data-tooltip]:hover::after {
                opacity: 1;
                visibility: visible;
            }

            [data-tooltip]:hover::after {
                transform: translateX(-50%) translateY(0);
            }

            /* Bottom position */
            [data-tooltip-pos="bottom"]::after {
                bottom: auto;
                top: calc(100% + 10px);
                transform: translateX(-50%) translateY(-5px);
            }

            [data-tooltip-pos="bottom"]::before {
                bottom: auto;
                top: calc(100% + 4px);
                border-top-color: transparent;
                border-bottom-color: rgba(15, 15, 20, 0.95);
            }

            [data-tooltip-pos="bottom"]:hover::after {
                transform: translateX(-50%) translateY(0);
            }

            /* Left position */
            [data-tooltip-pos="left"]::after {
                bottom: auto;
                left: auto;
                right: calc(100% + 10px);
                top: 50%;
                transform: translateY(-50%) translateX(5px);
            }

            [data-tooltip-pos="left"]::before {
                bottom: auto;
                left: auto;
                right: calc(100% + 4px);
                top: 50%;
                transform: translateY(-50%);
                border-top-color: transparent;
                border-left-color: rgba(15, 15, 20, 0.95);
            }

            [data-tooltip-pos="left"]:hover::after {
                transform: translateY(-50%) translateX(0);
            }

            /* Right position */
            [data-tooltip-pos="right"]::after {
                bottom: auto;
                left: calc(100% + 10px);
                top: 50%;
                transform: translateY(-50%) translateX(-5px);
            }

            [data-tooltip-pos="right"]::before {
                bottom: auto;
                left: calc(100% + 4px);
                top: 50%;
                transform: translateY(-50%);
                border-top-color: transparent;
                border-right-color: rgba(15, 15, 20, 0.95);
            }

            [data-tooltip-pos="right"]:hover::after {
                transform: translateY(-50%) translateX(0);
            }

            /* Info icon helper */
            .tooltip-icon {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 16px;
                height: 16px;
                background: rgba(124, 58, 237, 0.2);
                border: 1px solid rgba(124, 58, 237, 0.4);
                border-radius: 50%;
                font-size: 10px;
                color: #a78bfa;
                margin-left: 6px;
                cursor: help;
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    function addDefaultTooltips() {
        // Add tooltips to common elements that need explanation
        const tooltips = {
            '.hero-stat:nth-child(1)': 'Projets livrés avec succès',
            '.hero-stat:nth-child(2)': 'Taux de satisfaction client',
            '.hero-stat:nth-child(3)': 'Années d\'expérience cumulée',
        };

        Object.entries(tooltips).forEach(([selector, text]) => {
            const el = document.querySelector(selector);
            if (el && !el.hasAttribute('data-tooltip')) {
                el.setAttribute('data-tooltip', text);
            }
        });
    }

    function init() {
        injectStyles();
        addDefaultTooltips();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
