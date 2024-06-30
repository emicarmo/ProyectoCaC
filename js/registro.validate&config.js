// Validación de usuario
const usuario = document.getElementById('usuario');
const errorUsuario = document.getElementById('errorUsuario');
usuario.addEventListener('blur', validateUsuario);// blur metodo para la escucha dinamica al cambiar campo: presenta el error si lo hay

function validateUsuario() {
    const usuarioValue = usuario.value.trim();
    if (usuarioValue.length < 5 || !/^[\w\s._-]+$/.test(usuarioValue) || /\s{2,}/.test(usuarioValue)) {
        errorUsuario.textContent = 'El nombre de usuario debe tener al menos 5 caracteres, solo puede contener: letras, números, espacio entre caracteres (no dos espacios seguidos), guión bajo, guión medio y/o punto.';
        usuario.classList.add('is-invalid');
        return false;
    } else {
        errorUsuario.textContent = '';// Limpia mensaje de error si es valido
        usuario.classList.remove('is-invalid');
        return true;
    }
}

// Validación de email
const email = document.getElementById('email');
const errorEmail = document.getElementById('errorEmail');
email.addEventListener('blur', validateEmail);

function validateEmail() {
    const emailValue = email.value.trim();
    if (!emailValue.includes('@') || emailValue === '') {
        errorEmail.textContent = 'El email debe ser válido y contener "@".';
        email.classList.add('is-invalid');
        return false;
    } else {
        errorEmail.textContent = '';
        email.classList.remove('is-invalid');
        return true;
    }
}

// Validación de contraseña
const password = document.getElementById('password');
const errorPassword = document.getElementById('errorPassword');
password.addEventListener('blur', validatePassword);

function validatePassword() {
    const passwordValue = password.value.trim();
    if (passwordValue.length < 8) {
        errorPassword.textContent = 'La contraseña debe tener al menos 8 caracteres.';
        password.classList.add('is-invalid');
        return false;
    } else {
        errorPassword.textContent = '';
        password.classList.remove('is-invalid');
        return true;
    }
}

// Validación de confirmación de contraseña
const confirmPassword = document.getElementById('confirmPassword');
const errorConfirmPassword = document.getElementById('errorConfirmPassword');
confirmPassword.addEventListener('blur', validateConfirmPassword);

function validateConfirmPassword() {
    const confirmPasswordValue = confirmPassword.value.trim();
    const passwordValue = password.value.trim();
    if (confirmPasswordValue !== passwordValue || confirmPasswordValue === '') {
        errorConfirmPassword.textContent = 'Las contraseñas no coinciden.';
        confirmPassword.classList.add('is-invalid');
        return false;
    } else {
        errorConfirmPassword.textContent = '';
        confirmPassword.classList.remove('is-invalid');
        return true;
    }
}

// Validación y envío del formulario
document.getElementById('registroForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Previene el envío del formulario por defecto

    if (validateUsuario() && validateEmail() && validatePassword() && validateConfirmPassword()) {
        fetch(`${BACKEND_URL}/config`)
            .then(response => response.json())
            .then(config => {
                const BACKEND_URL = config.backendUrl;
                console.log(BACKEND_URL);//Eliminar despues de ver
                // Datos del formulario
                const formData = {
                    usuario: usuario.value.trim(),
                    email: email.value.trim(),
                    password: password.value.trim()
                };

                // Envío del formulario al backend
                fetch(`${BACKEND_URL}/usuario/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        window.location.href = 'URL_DE_REDIRECCIÓN'; // Redirige tras el éxito del registro
                    } else {
                        alert(data.message); // Muestra mensaje de error recibido del backend si hay error
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Hubo un problema con el registro. Inténtelo de nuevo.');
                });
            })
            .catch(error => {
                console.error('Error al obtener la configuración:', error);
            });
    }
    
});

