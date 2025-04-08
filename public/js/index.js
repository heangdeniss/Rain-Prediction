document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.querySelector('.toggle_btn');
  const dropdownMenu = document.querySelector('.dropdown_menu');

  toggleBtn.addEventListener('click', () => {
    dropdownMenu.classList.toggle('open');
  });
});
