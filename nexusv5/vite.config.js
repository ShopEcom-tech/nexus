import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    root: '.',
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                about: resolve(__dirname, 'pages/a-propos.html'),
                subscription: resolve(__dirname, 'pages/abonnement.html'),
                applications: resolve(__dirname, 'pages/applications.html'),
                authRequired: resolve(__dirname, 'pages/auth-required.html'),
                cancel: resolve(__dirname, 'pages/cancel.html'),
                cart: resolve(__dirname, 'pages/cart.html'),
                cgv: resolve(__dirname, 'pages/cgv.html'),
                checkout: resolve(__dirname, 'pages/checkout.html'),
                privacy: resolve(__dirname, 'pages/confidentialite.html'),
                contact: resolve(__dirname, 'pages/contact.html'),
                dashboard: resolve(__dirname, 'pages/dashboard.html'),
                login: resolve(__dirname, 'pages/login.html'),
                legal: resolve(__dirname, 'pages/mentions-legales.html'),
                offers: resolve(__dirname, 'pages/offres.html'),
                portfolio: resolve(__dirname, 'pages/portfolio.html'),
                services: resolve(__dirname, 'pages/services.html'),
                signup: resolve(__dirname, 'pages/signup.html'),
                success: resolve(__dirname, 'pages/success.html'),
                testimonials: resolve(__dirname, 'pages/temoignages.html')
            }
        }
    },
    server: {
        port: 3000,
        open: true
    }
});
