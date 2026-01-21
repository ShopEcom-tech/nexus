
/**
 * Contact Form Handling
 */
export function initContactForm() {
    // ========================================
    // CONTACT FORM
    // ========================================
    const contactForm = document.getElementById('contact-form');
    const formContent = document.querySelector('.contact-form');
    const formSuccess = document.querySelector('.form-success');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get submit button
            const submitBtn = contactForm.querySelector('.form-submit .btn');
            const originalText = submitBtn ? submitBtn.textContent : 'Envoyer';

            // Show loading state
            if (submitBtn) {
                submitBtn.textContent = 'Envoi en cours...';
                submitBtn.disabled = true;
            }

            // Collect form data
            const formData = {
                name: contactForm.querySelector('[name="name"]').value,
                email: contactForm.querySelector('[name="email"]').value,
                company: contactForm.querySelector('[name="company"]') ? contactForm.querySelector('[name="company"]').value : '',
                budget: contactForm.querySelector('[name="budget"]') ? contactForm.querySelector('[name="budget"]').value : '',
                message: contactForm.querySelector('[name="message"]').value,
                subject: 'Nouveau message via le formulaire de contact'
            };

            // Send via Brevo (EmailService)
            // Check if EmailService is available globally (from email-service.js)
            if (window.EmailService) {
                window.EmailService.sendContactFormEmail(formData)
                    .then(() => {
                        // Success handling
                        if (formContent && formSuccess) {
                            formContent.style.display = 'none';
                            formSuccess.style.display = 'block';
                        }
                        contactForm.reset();
                    })
                    .catch((error) => {
                        console.error('Erreur:', error);
                        alert('Une erreur est survenue lors de l\'envoi. Veuillez réessayer.');
                    })
                    .finally(() => {
                        // Reset button state
                        if (submitBtn) {
                            submitBtn.textContent = originalText;
                            submitBtn.disabled = false;
                        }

                        // Reset view after delay if successful
                        if (formContent && formContent.style.display === 'none') {
                            setTimeout(function () {
                                formContent.style.display = 'flex';
                                formSuccess.style.display = 'none';
                            }, 5000);
                        }
                    });
            } else {
                console.error('EmailService not loaded');
                // Fallback to basic submit if EmailService is missing but we want to allow form to "work" visually?
                // Or maybe the form uses Web3Forms as backup in HTML?
                // For now, consistent with original code:
                alert('Service d\'envoi indisponible.');
                if (submitBtn) {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            }
        });
    }
}
