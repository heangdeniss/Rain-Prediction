document.querySelector('.dropdown-btn').addEventListener('click', function() {
  const dropdownMenu = document.querySelector('.dropdown_menu');
  dropdownMenu.classList.toggle('open');
});

function confirmLogout() {
    const result = confirm("Are you sure you want to log out?");
    if (result) {
      window.location.href = "/"; 
    }
  }
  