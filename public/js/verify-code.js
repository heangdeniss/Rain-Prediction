document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    const codeInput = document.querySelector('#verificationCode');
    const errorMessage = document.querySelector('.error-message');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const code = codeInput.value.trim();
        if (!code || !/^\d{4}$/.test(code)) {
            showError("Please enter a valid 4-digit verification code.");
        } else {
            form.submit();
        }
    });

    function showError(message) {
        if (errorMessage) {
            errorMessage.style.display = 'block';
            errorMessage.textContent = message;
        }
    }
});
