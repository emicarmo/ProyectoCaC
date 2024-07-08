// Login: validate & config

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
const password = document.getElementById('password');
const errorPassword = document.getElementById('errorPassword');
password.addEventListener('blur', validatePassword, { passive: true });

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

// Validacion y envio del formulario
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Previene el envio del formulario por defecto

    if (validateEmail() && validatePassword()) {
        console.log('Validaciones de formulario pasadas, solicitando configuración del backend...');

        fetch(`http://localhost:3000/api/config`)
            .then(response => {
                console.log('login.js: Respuesta recibida del endpoint /api/config:', response);
                if (!response.ok) {
                    throw new Error('Error en la respuesta del servidor de configuración');
                }
                return response.json();
            })

            .then(config => {
                console.log('login: Configuración recibida:', config);// BORRAR
                const BACKEND_URL = config.backendUrl;
                console.log('login: Backend URL:', BACKEND_URL);// BORRAR

                // Datos del formulario
                const formData = {
                    email: document.getElementById('email').value.trim(),
                    password: document.getElementById('password').value.trim()// Debe coincidir con lo esperado por el backend, revisar DB
                };
                console.log('Datos del formulario:', formData);// BORRAR

                // Envio del formulario al backend
                return fetch(`${BACKEND_URL}/api/users/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
            })

            .then(response => {
                console.log('loguin 2: Respuesta recibida del endpoint de login:', response);
                if (!response.ok) {
                    throw new Error('Error en la respuesta del backend de login');

                }
                return response.json();
            })

            .then(data => {
                console.log('loguin: Respuesta del backend en front:', data);// BORRAR una vez comprobado

                if (data.success) {
                    localStorage.setItem('token', data.token);
                    console.log('Token guardado en localStorage:', data.token);// Borrar
                    alert('Usuario logueado exitosamente');// Muestra mensaje de exito
                    window.location.href = 'perfil.html'; // Redirige tras el exito del login
                    console.log('2 desde loguin Token guardado en localStorage:', data.token);// Borrar

                } else {
                    alert(`Error al iniciar sesión: ${data.message}`); // Muestra mensaje de error recibido del backend si hay error
                }
            })
            
            .catch(error => {
                console.error('Error en el proceso de login:', error);
                alert('Hubo un problema con el login. Inténtelo de nuevo.');// Aqui mostrar error que empieza en validator.js pasa a controller y lo dispara al front en .json
            });

    } else {
        console.log('Validaciones de formulario fallidas');
    }

    
});

