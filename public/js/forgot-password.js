document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    const emailInput = document.querySelector('#email');
    const errorMessage = document.querySelector('.error-message');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const email = emailInput.value.trim();
        if (!email || !validateEmail(email)) {
            showError("Please enter a valid email.");
        } else {
            form.submit();
        }
    });

    function validateEmail(email) {
        const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return re.test(email);
    }

    function showError(message) {
        if (errorMessage) {
            errorMessage.style.display = 'block';
            errorMessage.textContent = message;
        }
    }
});
