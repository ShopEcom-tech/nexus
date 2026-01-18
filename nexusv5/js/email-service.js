/**
 * Email Service - Brevo Integration
 * Envoie d'emails transactionnels via l'API Brevo
 */

(function () {
    'use strict';

    // Configuration Brevo
    const BREVO_CONFIG = {
        // Clé API Brevo
        // Clé API Brevo (Doit être configurée via EmailService.setApiKey() ou variables d'env)
        apiKey: null,
        apiUrl: 'https://api.brevo.com/v3/smtp/email',

        // Expéditeur par défaut
        sender: {
            name: 'Web Shop',
            email: 'alphaacademy2026@outlook.com'
        }
    };

    // Templates d'emails
    const EMAIL_TEMPLATES = {
        // Email de confirmation de commande
        orderConfirmation: (data) => ({
            subject: `✅ Commande confirmée - Web Shop #${data.orderId}`,
            htmlContent: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f0f15; color: #ffffff; border-radius: 16px; overflow: hidden;">
                    <div style="background: linear-gradient(135deg, #7c3aed, #db2777); padding: 40px 30px; text-align: center;">
                        <h1 style="margin: 0; font-size: 28px;">🎉 Merci pour votre commande !</h1>
                    </div>
                    <div style="padding: 30px;">
                        <p style="font-size: 16px; color: #a1a1aa;">Bonjour <strong style="color: #fff;">${data.firstName}</strong>,</p>
                        <p style="font-size: 16px; color: #a1a1aa;">Votre commande a bien été reçue et est en cours de traitement.</p>
                        
                        <div style="background: #1a1a24; border-radius: 12px; padding: 20px; margin: 20px 0;">
                            <h3 style="margin-top: 0; color: #a855f7;">📦 Récapitulatif</h3>
                            <p style="margin: 5px 0; color: #e4e4e7;">Numéro de commande: <strong>#${data.orderId}</strong></p>
                            <p style="margin: 5px 0; color: #e4e4e7;">Total: <strong style="color: #10b981;">${data.total}€</strong></p>
                        </div>
                        
                        <p style="font-size: 14px; color: #71717a;">Nous vous contacterons sous 24-48h pour discuter de votre projet.</p>
                        
                        <div style="text-align: center; margin-top: 30px;">
                            <a href="https://webshop.fr" style="display: inline-block; background: linear-gradient(135deg, #7c3aed, #db2777); color: #fff; padding: 14px 30px; border-radius: 30px; text-decoration: none; font-weight: 600;">Visiter notre site</a>
                        </div>
                    </div>
                    <div style="background: #0a0a0f; padding: 20px; text-align: center;">
                        <p style="margin: 0; font-size: 12px; color: #52525b;">© 2026 Web Shop - Agence Web Premium</p>
                    </div>
                </div>
            `
        }),

        // Email de bienvenue (inscription newsletter)
        welcome: (data) => ({
            subject: '🚀 Bienvenue chez Web Shop !',
            htmlContent: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f0f15; color: #ffffff; border-radius: 16px; overflow: hidden;">
                    <div style="background: linear-gradient(135deg, #7c3aed, #db2777); padding: 40px 30px; text-align: center;">
                        <h1 style="margin: 0; font-size: 28px;">Bienvenue ${data.firstName || ''} ! 👋</h1>
                    </div>
                    <div style="padding: 30px;">
                        <p style="font-size: 16px; color: #a1a1aa;">Merci de rejoindre la communauté Web Shop !</p>
                        <p style="font-size: 16px; color: #a1a1aa;">Vous recevrez nos meilleurs conseils et offres exclusives.</p>
                        
                        <div style="background: #1a1a24; border-radius: 12px; padding: 20px; margin: 20px 0;">
                            <h3 style="margin-top: 0; color: #a855f7;">💡 Ce que vous allez recevoir :</h3>
                            <ul style="color: #e4e4e7; padding-left: 20px;">
                                <li>Conseils pour booster votre présence en ligne</li>
                                <li>Offres exclusives réservées aux abonnés</li>
                                <li>Études de cas de nos clients</li>
                            </ul>
                        </div>
                        
                        <div style="text-align: center; margin-top: 30px;">
                            <a href="https://webshop.fr/pages/offres.html" style="display: inline-block; background: linear-gradient(135deg, #7c3aed, #db2777); color: #fff; padding: 14px 30px; border-radius: 30px; text-decoration: none; font-weight: 600;">Découvrir nos offres</a>
                        </div>
                    </div>
                </div>
            `
        }),

        // Email de formulaire de contact
        contactForm: (data) => ({
            subject: `📩 Nouveau message de ${data.name}`,
            htmlContent: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f0f15; color: #ffffff; border-radius: 16px; overflow: hidden;">
                    <div style="background: linear-gradient(135deg, #7c3aed, #db2777); padding: 30px; text-align: center;">
                        <h1 style="margin: 0; font-size: 24px;">📩 Nouveau message</h1>
                    </div>
                    <div style="padding: 30px;">
                        <div style="background: #1a1a24; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                            <p style="margin: 8px 0; color: #a1a1aa;"><strong style="color: #a855f7;">Nom:</strong> ${data.name}</p>
                            <p style="margin: 8px 0; color: #a1a1aa;"><strong style="color: #a855f7;">Email:</strong> ${data.email}</p>
                            <p style="margin: 8px 0; color: #a1a1aa;"><strong style="color: #a855f7;">Téléphone:</strong> ${data.phone || 'Non renseigné'}</p>
                            <p style="margin: 8px 0; color: #a1a1aa;"><strong style="color: #a855f7;">Sujet:</strong> ${data.subject || 'Non spécifié'}</p>
                        </div>
                        <div style="background: #1a1a24; border-radius: 12px; padding: 20px;">
                            <h3 style="margin-top: 0; color: #a855f7;">💬 Message:</h3>
                            <p style="color: #e4e4e7; white-space: pre-wrap;">${data.message}</p>
                        </div>
                    </div>
                </div>
            `
        }),

        // Email de confirmation de RDV
        appointmentConfirmation: (data) => ({
            subject: `📅 RDV confirmé - ${data.date}`,
            htmlContent: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f0f15; color: #ffffff; border-radius: 16px; overflow: hidden;">
                    <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 40px 30px; text-align: center;">
                        <h1 style="margin: 0; font-size: 28px;">📅 Rendez-vous confirmé !</h1>
                    </div>
                    <div style="padding: 30px;">
                        <p style="font-size: 16px; color: #a1a1aa;">Bonjour <strong style="color: #fff;">${data.firstName}</strong>,</p>
                        <p style="font-size: 16px; color: #a1a1aa;">Votre rendez-vous est bien confirmé !</p>
                        
                        <div style="background: #1a1a24; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center;">
                            <p style="font-size: 24px; color: #10b981; margin: 0;">${data.date}</p>
                            <p style="font-size: 18px; color: #e4e4e7; margin: 10px 0 0 0;">${data.time}</p>
                        </div>
                        
                        <p style="font-size: 14px; color: #71717a;">Vous recevrez un lien de visioconférence 1h avant le rendez-vous.</p>
                    </div>
                </div>
            `
        })
    };

    /**
     * Envoyer un email via Brevo API
     */
    async function sendEmail(to, templateName, data) {
        // Vérifier la configuration
        if (BREVO_CONFIG.apiKey === 'YOUR_BREVO_API_KEY') {
            console.warn('⚠️ Brevo API key non configurée. Email non envoyé.');
            console.log('📧 Email simulé:', { to, templateName, data });
            return { success: true, simulated: true };
        }

        // Récupérer le template
        const template = EMAIL_TEMPLATES[templateName];
        if (!template) {
            throw new Error(`Template "${templateName}" non trouvé`);
        }

        const emailContent = template(data);

        // Préparer la requête
        const payload = {
            sender: BREVO_CONFIG.sender,
            to: [{ email: to, name: data.firstName || to }],
            subject: emailContent.subject,
            htmlContent: emailContent.htmlContent
        };

        try {
            const response = await fetch(BREVO_CONFIG.apiUrl, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'api-key': BREVO_CONFIG.apiKey,
                    'content-type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Erreur envoi email');
            }

            const result = await response.json();
            console.log('✅ Email envoyé:', result);
            return { success: true, messageId: result.messageId };

        } catch (error) {
            console.error('❌ Erreur envoi email:', error);
            throw error;
        }
    }

    /**
     * Envoyer un email de confirmation de commande
     */
    async function sendOrderConfirmation(email, orderData) {
        return sendEmail(email, 'orderConfirmation', orderData);
    }

    /**
     * Envoyer un email de bienvenue
     */
    async function sendWelcomeEmail(email, userData) {
        return sendEmail(email, 'welcome', userData);
    }

    /**
     * Envoyer un email du formulaire de contact
     */
    async function sendContactFormEmail(formData) {
        // Envoyer à l'admin
        await sendEmail(BREVO_CONFIG.sender.email, 'contactForm', formData);

        // Optionnel: envoyer une confirmation au visiteur
        // await sendEmail(formData.email, 'contactConfirmation', formData);

        return { success: true };
    }

    /**
     * Envoyer une confirmation de RDV
     */
    async function sendAppointmentConfirmation(email, appointmentData) {
        return sendEmail(email, 'appointmentConfirmation', appointmentData);
    }

    // Exposer les fonctions globalement
    window.EmailService = {
        send: sendEmail,
        sendOrderConfirmation,
        sendWelcomeEmail,
        sendContactFormEmail,
        sendAppointmentConfirmation,

        // Pour configurer l'API key dynamiquement
        setApiKey: (key) => {
            BREVO_CONFIG.apiKey = key;
        },
        setSender: (name, email) => {
            BREVO_CONFIG.sender = { name, email };
        }
    };

    console.log('📧 Email Service (Brevo) chargé');

})();
