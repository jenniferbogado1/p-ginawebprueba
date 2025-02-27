document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.includes("index.html")) {
        checkSession();
        document.getElementById("loginForm").addEventListener("submit", login);
    }
    if (window.location.pathname.includes("menu.html")) {
        document.getElementById("logoutButton").addEventListener("click", logout);
    }
});

// Definir usuarios en el script en vez de fetch()
const users = [
    { username: "admin", password: "1234" },
    { username: "usuario", password: "abcd" }
];

function login(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        localStorage.setItem("sessionUser", username);
        window.location.href = "menu.html";
    } else {
        document.getElementById("errorMessage").textContent = "Usuario o contraseña incorrectos";
    }
}

function checkSession() {
    if (localStorage.getItem("sessionUser")) {
        window.location.href = "menu.html";
    }
}

function logout() {
    localStorage.removeItem("sessionUser");
    window.location.href = "index.html";
}