document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    // Only run if contact form exists on the page
    if (!form) return;

    const submitBtn = document.getElementById('submit-btn');
    const formSuccess = document.getElementById('form-success');
    const formError = document.getElementById('form-error');

    // Validation functions
    function validateEmail(email) {
        const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        return re.test(email);
    }

    function showFieldError(field, message) {
        field.style.borderColor = '#ef4444';
        let error = field.nextElementSibling;
        if (!error || !error.classList.contains('field-error')) {
            error = document.createElement('div');
            error.className = 'field-error';
            error.style.cssText = 'color: #ef4444; font-size: 0.85rem; margin-top: 0.25rem;';
            field.parentNode.insertBefore(error, field.nextSibling);
        }
        error.textContent = message;
    }

    function clearFieldError(field) {
        field.style.borderColor = '';
        const error = field.nextElementSibling;
        if (error && error.classList.contains('field-error')) {
            error.remove();
        }
    }

    // Real-time validation
    form.querySelectorAll('input, textarea').forEach(field => {
        field.addEventListener('blur', function () {
            validateField(this);
        });
        field.addEventListener('input', function () {
            clearFieldError(this);
        });
    });

    function validateField(field) {
        clearFieldError(field);

        if (field.name === 'name' && (!field.value || field.value.trim().length < 2)) {
            showFieldError(field, 'Le nom doit contenir au moins 2 caractères');
            return false;
        }

        if (field.name === 'email') {
            if (!field.value) {
                showFieldError(field, 'L\'email est requis');
                return false;
            }
            if (!validateEmail(field.value)) {
                showFieldError(field, 'Format d\'email invalide');
                return false;
            }
        }

        if (field.name === 'message' && (!field.value || field.value.trim().length < 10)) {
            showFieldError(field, 'Le message doit contenir au moins 10 caractères');
            return false;
        }

        return true;
    }

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Validate all fields
        const nameField = form.querySelector('[name="name"]');
        const emailField = form.querySelector('[name="email"]');
        const messageField = form.querySelector('[name="message"]');

        const isNameValid = validateField(nameField);
        const isEmailValid = validateField(emailField);
        const isMessageValid = validateField(messageField);

        if (!isNameValid || !isEmailValid || !isMessageValid) {
            return;
        }

        // Change button state
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Envoi en cours...';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';

        // Prepare form data
        const formData = new FormData(form);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            });

            const result = await response.json();

            if (result.success) {
                // Show success message
                form.style.display = 'none';
                formError.style.display = 'none';
                formSuccess.style.display = 'block';
                form.reset();

                // Reset form after 5 seconds
                setTimeout(() => {
                    form.style.display = 'flex';
                    formSuccess.style.display = 'none';
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                }, 5000);
            } else {
                // Show error
                form.style.display = 'none';
                formError.style.display = 'block';

                setTimeout(() => {
                    form.style.display = 'flex';
                    formError.style.display = 'none';
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                }, 3000);
            }
        } catch (error) {
            // Network error
            form.style.display = 'none';
            formError.style.display = 'block';

            setTimeout(() => {
                form.style.display = 'flex';
                formError.style.display = 'none';
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
            }, 3000);
        }
    });
});
