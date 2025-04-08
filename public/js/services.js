const serviceBtns = document.querySelectorAll('.service-btn');
const serviceDetails = document.querySelectorAll('.service-details');

serviceBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        const details = serviceDetails[index];
        if (details.style.display === 'block') {
            details.style.display = 'none';
        } else {
            details.style.display = 'block';
        }
    });
});
