function confirmLogout() {
    const result = confirm("Are you sure you want to log out?");
    if (result) {
      window.location.href = "/"; 
    }
  }
  