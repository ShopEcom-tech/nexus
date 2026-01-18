/**
 * Booking Widget - Simplified
 * Innovation #6: Simple callback request form (no time slots)
 * User is often unavailable, so we just collect contact info
 */

(function () {
    'use strict';

    function injectStyles() {
        const styles = `
            .booking-section {
                margin-top: 40px;
                padding-top: 40px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }

            .booking-header {
                text-align: center;
                margin-bottom: 32px;
            }

            .booking-badge {
                display: inline-block;
                background: linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(16, 185, 129, 0.15));
                border: 1px solid rgba(34, 197, 94, 0.3);
                color: #4ade80;
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 13px;
                font-weight: 600;
                margin-bottom: 16px;
            }

            .booking-title {
                font-size: 24px;
                font-weight: 700;
                color: white;
                margin: 0 0 8px 0;
            }

            .booking-subtitle {
                color: #a1a1aa;
                font-size: 15px;
            }

            .booking-form {
                max-width: 400px;
                margin: 0 auto;
            }

            .booking-input {
                width: 100%;
                padding: 14px 18px;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                color: white;
                font-size: 15px;
                margin-bottom: 12px;
                transition: border-color 0.2s;
            }

            .booking-input:focus {
                outline: none;
                border-color: #4ade80;
            }

            .booking-input::placeholder {
                color: #71717a;
            }

            .booking-textarea {
                width: 100%;
                padding: 14px 18px;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                color: white;
                font-size: 15px;
                margin-bottom: 12px;
                min-height: 80px;
                resize: vertical;
                font-family: inherit;
            }

            .booking-textarea:focus {
                outline: none;
                border-color: #4ade80;
            }

            .booking-textarea::placeholder {
                color: #71717a;
            }

            .booking-note {
                background: rgba(124, 58, 237, 0.1);
                border: 1px solid rgba(124, 58, 237, 0.3);
                border-radius: 12px;
                padding: 16px;
                margin-bottom: 20px;
                text-align: center;
            }

            .booking-note-text {
                color: #a78bfa;
                font-size: 14px;
            }

            .booking-note-text strong {
                color: white;
            }

            .booking-submit {
                width: 100%;
                padding: 16px;
                background: linear-gradient(135deg, #22c55e, #10b981);
                border: none;
                border-radius: 12px;
                color: white;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
            }

            .booking-submit:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 20px rgba(34, 197, 94, 0.3);
            }

            .booking-submit:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                transform: none;
            }

            .booking-success {
                display: none;
                text-align: center;
                padding: 40px 20px;
            }

            .booking-success.visible {
                display: block;
            }

            .booking-success-icon {
                font-size: 64px;
                margin-bottom: 16px;
            }

            .booking-success-title {
                font-size: 24px;
                font-weight: 700;
                color: white;
                margin-bottom: 8px;
            }

            .booking-success-text {
                color: #a1a1aa;
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    function createBookingWidget() {
        // Only on contact page
        if (!window.location.pathname.includes('contact')) return;

        const contactForm = document.querySelector('.contact-form-card');
        if (!contactForm) return;

        const bookingSection = document.createElement('div');
        bookingSection.className = 'booking-section';
        bookingSection.id = 'booking-section';

        bookingSection.innerHTML = `
            <div class="booking-header">
                <div class="booking-badge">📞 Demande de rappel</div>
                <h3 class="booking-title">On vous rappelle !</h3>
                <p class="booking-subtitle">Laissez vos coordonnées, on vous recontacte rapidement</p>
            </div>

            <div class="booking-form" id="booking-form">
                <div class="booking-note">
                    <p class="booking-note-text">
                        💬 <strong>Réponse sous 24-48h</strong> - On s'adapte à vos disponibilités
                    </p>
                </div>
                
                <input type="text" class="booking-input" id="booking-name" placeholder="Votre nom *" required>
                <input type="email" class="booking-input" id="booking-email" placeholder="Votre email *" required>
                <input type="tel" class="booking-input" id="booking-phone" placeholder="Votre téléphone *" required>
                <textarea class="booking-textarea" id="booking-availability" placeholder="Vos disponibilités (ex: après 18h, le week-end...)"></textarea>
                
                <button class="booking-submit" onclick="window.submitCallbackRequest()">
                    📞 Demander un rappel
                </button>
            </div>

            <div class="booking-success" id="booking-success">
                <div class="booking-success-icon">✅</div>
                <h3 class="booking-success-title">Demande envoyée !</h3>
                <p class="booking-success-text">On vous recontacte très vite pour discuter de votre projet.</p>
            </div>
        `;

        contactForm.appendChild(bookingSection);
    }

    window.submitCallbackRequest = async function () {
        const name = document.getElementById('booking-name').value.trim();
        const email = document.getElementById('booking-email').value.trim();
        const phone = document.getElementById('booking-phone').value.trim();
        const availability = document.getElementById('booking-availability').value.trim();

        if (!name || !email || !phone) {
            alert('Veuillez remplir tous les champs obligatoires');
            return;
        }

        const submitBtn = document.querySelector('.booking-submit');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Envoi en cours...';

        const requestData = {
            name,
            email,
            phone,
            availability: availability || 'Non précisé',
            createdAt: new Date().toISOString()
        };

        // Save to Supabase if available
        if (window.supabaseClient) {
            try {
                await window.supabaseClient.from('callback_requests').insert(requestData);
                console.log('Callback request saved to database');
            } catch (error) {
                console.error('Error saving callback request:', error);
            }
        }

        // Show success
        document.getElementById('booking-form').style.display = 'none';
        document.getElementById('booking-success').classList.add('visible');

        // Trigger confetti if available
        if (window.triggerConfetti) {
            window.triggerConfetti();
        }

        // Send notification via Web3Forms
        try {
            await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    access_key: 'fe931fff-6701-4732-b225-e31c5e5791a3',
                    subject: `📞 Demande de rappel - ${name}`,
                    from_name: 'Nexus - Demande de rappel',
                    name: name,
                    email: email,
                    phone: phone,
                    availability: availability || 'Non précisé',
                    message: `Nouvelle demande de rappel !\n\nNom: ${name}\nEmail: ${email}\nTéléphone: ${phone}\nDisponibilités: ${availability || 'Non précisé'}`
                })
            });
        } catch (error) {
            console.error('Error sending notification:', error);
        }
    };

    function init() {
        injectStyles();

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createBookingWidget);
        } else {
            createBookingWidget();
        }
    }

    init();
})();
