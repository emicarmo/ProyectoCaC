// Valida usuario
const usuario = document.getElementById('usuario');
const errorUsuario = document.getElementById('errorUsuario');
usuario.addEventListener('blur', validateUsuario);// blur metodo para la escucha dinamica al cambiar campo: presenta el error si lo hay

function validateUsuario() {
    const usuarioValue = usuario.value.trim();
    if (usuarioValue.length < 5 || !/^[\w\s._-]+$/.test(usuarioValue) || /\s{2,}/.test(usuarioValue)) {// Regex -regular expresion- excelente para determinar filtros
        errorUsuario.textContent = 'El nombre de usuario debe tener al menos 5 caracteres, solo puede contener: letras, números, espacio entre caracteres (no dos espacios seguidos), guión bajo, guión medio y/o punto.';
        usuario.classList.add('is-invalid');
        return false;
    } else {
        errorUsuario.textContent = '';// Limpia mensaje de error si es valido
        usuario.classList.remove('is-invalid');
        return true;
    }
}

// Valida email
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

// Valida contraseña
const contrasena = document.getElementById('contrasena');
const errorcontrasena = document.getElementById('errorcontrasena');
contrasena.addEventListener('blur', validatecontrasena);

function validatecontrasena() {
    const contrasenaValue = contrasena.value.trim();
    if (contrasenaValue.length < 8) {
        errorcontrasena.textContent = 'La contraseña debe tener al menos 8 caracteres.';
        contrasena.classList.add('is-invalid');
        return false;
    } else {
        errorcontrasena.textContent = '';
        contrasena.classList.remove('is-invalid');
        return true;
    }
}

// Valida confirmación de contraseña
const confirmcontrasena = document.getElementById('confirmcontrasena');
const errorConfirmcontrasena = document.getElementById('errorConfirmcontrasena');
confirmcontrasena.addEventListener('blur', validateConfirmcontrasena);

function validateConfirmcontrasena() {
    const confirmcontrasenaValue = confirmcontrasena.value.trim();
    const contrasenaValue = contrasena.value.trim();
    if (confirmcontrasenaValue !== contrasenaValue || confirmcontrasenaValue === '') {
        errorConfirmcontrasena.textContent = 'Las contraseñas no coinciden.';
        confirmcontrasena.classList.add('is-invalid');
        return false;
    } else {
        errorConfirmcontrasena.textContent = '';
        confirmcontrasena.classList.remove('is-invalid');
        return true;
    }
}

// Validacion y envio del formulario
document.getElementById('registroForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Previene el envio del formulario por defecto

    if (validateUsuario() && validateEmail() && validatecontrasena() && validateConfirmcontrasena()) {
        console.log('Validaciones de formulario pasadas, solicitando configuración del backend...');

        fetch(`http://localhost:3000/api/config`)
            .then(response => {
                console.log('Respuesta recibida del endpoint /api/config:', response);
                if (!response.ok) {
                    throw new Error('Error en la respuesta del servidor de configuración');
                }
                return response.json();
            })
            .then(config => {
                console.log('Configuración recibida:', config);
                const BACKEND_URL = config.backendUrl;
                console.log('Backend URL:', BACKEND_URL);

                // Datos del formulario
                const formData = {
                    usuario: document.getElementById('usuario').value.trim(),
                    email: document.getElementById('email').value.trim(),
                    contrasena: document.getElementById('contrasena').value.trim()// Debe coincidir con lo esperado por el backend, revisar DB
                };

                console.log('Datos del formulario:', formData);

                // Envio del formulario al backend
                return fetch(`${BACKEND_URL}/api/users/usuario/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
            })
            .then(response => {
                console.log('Respuesta recibida del endpoint de registro:', response);
                if (!response.ok) {
                    throw new Error('Error en la respuesta del backend de registro');
                }
                return response.json();
            })
            .then(data => {
                console.log('Respuesta del backend:', data);
                if (data.success) {
                    window.location.href = 'login.html'; // Redirige tras el exito del registro
                } else {
                    alert(data.message); // Muestra mensaje de error recibido del backend si hay error
                }
            })
            .catch(error => {
                console.error('Error en el proceso de registro:', error);
                alert('Hubo un problema con el registro. Inténtelo de nuevo.');
            });
    } else {
        console.log('Validaciones de formulario fallidas');
    }

});

