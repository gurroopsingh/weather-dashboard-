const loginForm = document.getElementById("loginForm");
const errorNotification = document.getElementById("errorNotification");

// Redirect if already logged in during current session
if (sessionStorage.getItem("loggedIn") === "true") {
    window.location.href = "dashboard.html";
}

function showError(message) {
    errorNotification.textContent = message;
    errorNotification.classList.remove("hidden");
    errorNotification.classList.add("show");
}

loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    // Hide error initially
    errorNotification.classList.add("hidden");
    errorNotification.classList.remove("show");

    try {
        const response = await fetch("data/users.json");
        const users = await response.json();

        const validUser = users.find(function(user){
            return user.username === username && user.password === password;
        });

        if (validUser) {
            // Save login state in sessionStorage
            sessionStorage.setItem("loggedIn", "true");
            window.location.href = "dashboard.html";
        } else {
            showError("Invalid username or password.");
        }
    } catch (error) {
        showError("Unable to load users.");
    }
});