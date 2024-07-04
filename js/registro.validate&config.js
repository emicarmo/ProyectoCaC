// Valida usuario
const usuario = document.getElementById('usuario');
const errorUsuario = document.getElementById('errorUsuario');
usuario.addEventListener('blur', validateUsuario, { passive: true });// blur metodo para la escucha dinamica al cambiar campo: presenta el error si lo hay. Se agrega { passive: true } como tercer parmetro para prevenir que el navegador detenga el normal flujo


function validateUsuario() {
    const usuarioValue = usuario.value.trim();
    if (usuarioValue.length < 5 || !/^[\wñÑ\s._-]+$/.test(usuarioValue) || /\s{2,}/.test(usuarioValue)) {// Regex (!/^[\wñÑ\s._-]+$/) -regular expresion- su uso es excelente para determinar filtros
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
email.addEventListener('blur', validateEmail, { passive: true });

function validateEmail() {
    const emailValue = email.value.trim();
    if (!/^[\wñÑ](?:[\wñÑ._-]*[\wñÑ])?@[A-Za-z0-9](?:[A-Za-z0-9.-]*[A-Za-z0-9])?\.[A-Za-z]{2,}$/.test(emailValue)) {
        errorEmail.textContent = 'El email debe ser válido: contener "@", sin espacios en blanco solo se permiten punto, guión medio, guión bajo y no se permiten dos juntos. Controle la finalzación "puntoAlgo" debe ser válida';
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
contrasena.addEventListener('blur', validatecontrasena, { passive: true });

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
confirmcontrasena.addEventListener('blur', validateConfirmcontrasena, { passive: true });

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
                console.log('Configuración recibida:', config);// BORRAR
                const BACKEND_URL = config.backendUrl;
                console.log('Backend URL:', BACKEND_URL);// BORRAR

                // Datos del formulario
                const formData = {
                    usuario: document.getElementById('usuario').value.trim(),
                    email: document.getElementById('email').value.trim(),
                    contrasena: document.getElementById('contrasena').value.trim()// Debe coincidir con lo esperado por el backend, revisar DB
                };
                console.log('Datos del formulario:', formData);// BORRAR

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
                console.log('1 Respuesta del backend en front:', data);// BORRAR una vez comprobado
                //const result = data.result;// Obtenemos la respuesta del backend
                //alert(`2 Respuesta del backend: ${result}`);// BORRAR una vez comprobado

                if (data.success) {
                    alert('Usuario registrado exitosamente');// Muestra mensaje de exito
                    window.location.href = 'login.html'; // Redirige tras el exito del registro

                } else {
                    alert(`Luego de Registrar la devolucion dice: ${data.message}`); // Muestra mensaje de error recibido del backend si hay error
                }
            })
            
            .catch(error => {
                console.error('Error en el proceso de registro:', error);
                alert('Hubo un problema con el registro. Inténtelo de nuevo.');// Aqui mostrar error que empieza en validator.js pasa a controller y lo dispara al front en .json
            });

    } else {
        console.log('Validaciones de formulario fallidas');
    }

});

