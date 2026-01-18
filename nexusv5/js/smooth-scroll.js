/**
 * Nexus v5 - Smooth Scroll Manager (Lenis)
 * 
 * Intègre le défilement fluide "inertiel" utilisé par les sites Awwwards.
 * Synchronisé avec GSAP ScrollTrigger pour des animations parfaites.
 */

import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

export function initSmoothScroll() {

    // --- 1. Configuration Initiale ---
    const lenis = new Lenis({
        duration: 0.6,              // Reduced from 1.2 to 0.6 for responsive/snappy feel (less latency)
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing exponentiel
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1.2,       // Increased responsiveness
        smoothTouch: false,         // Désactiver sur mobile pour performance native (souvent mieux)
        touchMultiplier: 2,
    });

    // --- 2. Synchronisation GSAP (Vital pour ScrollTrigger) ---
    // Dire à ScrollTrigger qu'un scroll a eu lieu quand Lenis bouge
    lenis.on('scroll', ScrollTrigger.update);

    // Utiliser la boucle (ticker) de GSAP pour mettre à jour Lenis
    // Cela assure une synchro parfaite frame-par-frame sans décalage
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    // Désactiver le lissage de lag GSAP car Lenis gère déjà le lissage
    gsap.ticker.lagSmoothing(0);

    console.log('%c🌊 Smooth Scroll & GSAP Synced', 'color: #38bdf8; font-weight: bold;');

    // --- 3. Exposition Globale ---
    // Permet de contrôler le scroll depuis d'autres scripts (ex: modales, preloader)
    window.lenis = lenis;

    window.NexusScroll = {
        stop: () => lenis.stop(),
        start: () => lenis.start(),
        scrollTo: (target, options) => lenis.scrollTo(target, options)
    };

    // --- 4. Fix pour les liens d'ancrage (#) ---
    // Note: This might conflict with script.js anchor handling, but Lenis needs to handle it if active.
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Check if we should prevent default (if not already handled)
            // But usually Lenis scrollTo is checking e.preventDefault
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                lenis.scrollTo(targetId);
            }
        });
    });
}
