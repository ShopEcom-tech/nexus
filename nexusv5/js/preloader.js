/**
 * Animated Preloader - Premium Design
 * Innovation #11: Premium loading animation
 */

(function () {
    'use strict';

    const CONFIG = {
        minDisplayTime: 800, // Quick but visible
        fadeOutDuration: 600
    };

    function injectStyles() {
        const styles = `
            .preloader {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: radial-gradient(ellipse at center, #1a1a2e 0%, #0a0a0f 100%);
                z-index: 99999;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                transition: opacity ${CONFIG.fadeOutDuration}ms ease, visibility ${CONFIG.fadeOutDuration}ms ease;
                overflow: hidden;
            }

            .preloader.hidden {
                opacity: 0;
                visibility: hidden;
                pointer-events: none;
            }

            /* Animated background particles */
            .preloader::before {
                content: '';
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: radial-gradient(circle, rgba(124, 58, 237, 0.1) 1px, transparent 1px);
                background-size: 50px 50px;
                animation: preloader-bg-move 20s linear infinite;
            }

            @keyframes preloader-bg-move {
                0% { transform: translate(0, 0); }
                100% { transform: translate(50px, 50px); }
            }

            /* Main content container */
            .preloader-content {
                position: relative;
                z-index: 1;
                text-align: center;
            }

            /* Logo container with rotating ring */
            .preloader-logo-wrapper {
                position: relative;
                width: 120px;
                height: 120px;
                margin: 0 auto 30px;
            }

            /* Rotating outer ring */
            .preloader-ring {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border-radius: 50%;
                border: 3px solid transparent;
                border-top-color: #a855f7;
                border-right-color: #ec4899;
                animation: preloader-spin 1.2s linear infinite;
            }

            .preloader-ring::before {
                content: '';
                position: absolute;
                top: 5px;
                left: 5px;
                right: 5px;
                bottom: 5px;
                border-radius: 50%;
                border: 2px solid transparent;
                border-top-color: #06b6d4;
                border-left-color: #8b5cf6;
                animation: preloader-spin-reverse 1.5s linear infinite;
            }

            @keyframes preloader-spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            @keyframes preloader-spin-reverse {
                0% { transform: rotate(360deg); }
                100% { transform: rotate(0deg); }
            }

            /* Logo in center */
            .preloader-logo {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 70px;
                height: 70px;
            }

            .preloader-logo img {
                width: 100%;
                height: 100%;
                object-fit: contain;
                animation: preloader-logo-pulse 2s ease-in-out infinite;
            }

            @keyframes preloader-logo-pulse {
                0%, 100% { 
                    transform: scale(1);
                    filter: drop-shadow(0 0 10px rgba(168, 85, 247, 0.3));
                }
                50% { 
                    transform: scale(1.05);
                    filter: drop-shadow(0 0 25px rgba(168, 85, 247, 0.6));
                }
            }

            /* Brand name */
            .preloader-brand {
                font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
                font-size: 28px;
                font-weight: 800;
                background: linear-gradient(135deg, #a855f7, #ec4899);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                margin-bottom: 30px;
                letter-spacing: -0.5px;
            }

            /* Modern progress bar */
            .preloader-progress {
                width: 200px;
                height: 3px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 10px;
                overflow: hidden;
                position: relative;
            }

            .preloader-progress-bar {
                height: 100%;
                background: linear-gradient(90deg, #a855f7, #ec4899, #06b6d4);
                background-size: 200% 100%;
                border-radius: 10px;
                width: 0%;
                transition: width 0.2s ease;
                animation: preloader-gradient 2s ease infinite;
            }

            @keyframes preloader-gradient {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }

            /* Loading text */
            .preloader-status {
                margin-top: 20px;
                font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
                font-size: 13px;
                color: rgba(255, 255, 255, 0.4);
                letter-spacing: 3px;
                text-transform: uppercase;
            }

            /* Floating particles effect */
            .preloader-particle {
                position: absolute;
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: linear-gradient(135deg, #a855f7, #ec4899);
                opacity: 0.3;
                animation: preloader-float 4s ease-in-out infinite;
            }

            @keyframes preloader-float {
                0%, 100% { transform: translateY(0) scale(1); opacity: 0.3; }
                50% { transform: translateY(-20px) scale(1.2); opacity: 0.6; }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    function createPreloader() {
        const preloader = document.createElement('div');
        preloader.className = 'preloader';
        preloader.id = 'preloader';

        // Create floating particles
        let particles = '';
        for (let i = 0; i < 6; i++) {
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            const delay = Math.random() * 2;
            const size = 4 + Math.random() * 4;
            particles += `<div class="preloader-particle" style="left: ${left}%; top: ${top}%; width: ${size}px; height: ${size}px; animation-delay: ${delay}s;"></div>`;
        }

        preloader.innerHTML = `
            ${particles}
            <div class="preloader-content">
                <div class="preloader-logo-wrapper">
                    <div class="preloader-ring"></div>
                    <div class="preloader-logo">
                        <img src="images/webshop-logo.png" alt="Web Shop" onerror="this.onerror=null; this.src='../images/webshop-logo.png';">
                    </div>
                </div>
                <div class="preloader-brand">Web Shop</div>
                <div class="preloader-progress">
                    <div class="preloader-progress-bar" id="preloader-bar"></div>
                </div>
                <div class="preloader-status">Chargement...</div>
            </div>
        `;

        document.body.insertBefore(preloader, document.body.firstChild);
        return preloader;
    }

    function simulateProgress() {
        const bar = document.getElementById('preloader-bar');
        if (!bar) return;

        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 12;
            if (progress > 95) progress = 95;
            bar.style.width = progress + '%';

            if (progress >= 95) clearInterval(interval);
        }, 80);

        return interval;
    }

    function hidePreloader() {
        const preloader = document.getElementById('preloader');
        const bar = document.getElementById('preloader-bar');

        if (bar) bar.style.width = '100%';

        setTimeout(() => {
            if (preloader) {
                preloader.classList.add('hidden');
                setTimeout(() => {
                    preloader.remove();
                }, CONFIG.fadeOutDuration);
            }
        }, 300);
    }

    function init() {
        injectStyles();
        createPreloader();

        const progressInterval = simulateProgress();
        const startTime = Date.now();

        window.addEventListener('load', () => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, CONFIG.minDisplayTime - elapsed);

            clearInterval(progressInterval);
            setTimeout(hidePreloader, remaining);
        });

        setTimeout(() => {
            clearInterval(progressInterval);
            hidePreloader();
        }, 5000);
    }

    init();
})();
