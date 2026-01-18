/**
 * Nexus v5 - Smooth Scroll Manager (Lenis)
 * 
 * Intègre le défilement fluide "inertiel" utilisé par les sites Awwwards.
 * Synchronisé avec GSAP ScrollTrigger pour des animations parfaites.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Vérifier si Lenis est chargé via CDN
    if (typeof Lenis === 'undefined') {
        console.warn('[Smooth Scroll] Lenis library not loaded.');
        return;
    }

    // --- 1. Configuration Initiale ---
    const lenis = new Lenis({
        duration: 1.2,              // Durée de l'inertie (plus c'est haut, plus c'est "lourd")
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing exponentiel
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,         // Désactiver sur mobile pour performance native (souvent mieux)
        touchMultiplier: 2,
    });

    // --- 2. Synchronisation GSAP (Vital pour ScrollTrigger) ---
    // Si GSAP et ScrollTrigger sont présents, on connecte les deux
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {

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
    } else {
        // Fallback sans GSAP : boucle d'animation standard
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
        console.log('%c🌊 Smooth Scroll Enabled (Standalone)', 'color: #38bdf8; font-weight: bold;');
    }

    // --- 3. Exposition Globale ---
    // Permet de contrôler le scroll depuis d'autres scripts (ex: modales, preloader)
    window.lenis = lenis;

    window.NexusScroll = {
        stop: () => lenis.stop(),
        start: () => lenis.start(),
        scrollTo: (target, options) => lenis.scrollTo(target, options)
    };

    // --- 4. Fix pour les liens d'ancrage (#) ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                lenis.scrollTo(targetId);
            }
        });
    });
});
