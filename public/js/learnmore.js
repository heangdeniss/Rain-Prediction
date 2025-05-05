// scripts.js

document.addEventListener("DOMContentLoaded", function() {
    const faqButtons = document.querySelectorAll('.faq-question');
    
    faqButtons.forEach(button => {
      button.addEventListener('click', function() {
        const answer = this.nextElementSibling;
        // Toggle the visibility of the answer
        answer.style.display = (answer.style.display === 'block') ? 'none' : 'block';
      });
    });
  });
  