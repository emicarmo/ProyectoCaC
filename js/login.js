document.addEventListener('DOMContentLoaded', { passive: true }, function () {
    const form = document.getElementById('loginForm');
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (email === "codoacodo@gmail.com" && password === "nodejs2024") {
            alert(`¡Inicio de sesión exitoso!`);
            window.location.href = 'productos.html?user=admin';
        } else {
            alert(`Usuario o contraseña incorrecto`);
        }
    });
});