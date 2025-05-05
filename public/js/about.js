document.addEventListener("DOMContentLoaded", () => {
    const backHomeButton = document.getElementById("backHome");
    backHomeButton.addEventListener("click", () => {
        window.location.href = "/";
    });
});