const loginForm = document.getElementById("loginForm");
const error = document.getElementById("error");

loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    error.textContent = "";

    try {

        const response = await fetch("data/users.json");

        const users = await response.json();

        const validUser = users.find(function(user){

            return user.username === username &&
                   user.password === password;

        });

        if(validUser){

            window.location.href = "dashboard.html";

        }

        else{

            error.textContent = "Invalid username or password.";

        }

    }

    catch(errorMessage){

        error.textContent = "Unable to load users.";

    }

});