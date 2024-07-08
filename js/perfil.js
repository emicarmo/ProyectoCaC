// Perfil: request, validate & config

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('1 en perfil: No hay token disponible');
        }

        const configResponse = await fetch('http://localhost:3000/api/config');
        if (!configResponse.ok) {
            throw new Error('en perfil js  error:  Error en la respuesta del servidor de configuración');
        }
        const config = await configResponse.json();
        const BACKEND_URL = config.backendUrl;

        console.log(' perfil 1.s :ruta  BACKEND_URL:', BACKEND_URL);

        const perfilResponse = await fetch(`${BACKEND_URL}/api/users/usuario/perfil`, { 
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!perfilResponse.ok) {
            throw new Error(' Perfil 2: perfilResponse con fetch hace GET para traer datos al formulario Error al obtener los datos del usuario');
        }
        const data = await perfilResponse.json();

        document.getElementById('usuario').textContent = data.usuario;
        document.getElementById('email').textContent = data.email;
        //document.getElementById('password').textContent = data.password;
        document.getElementById('nombre').value = data.nombre || '';
        document.getElementById('apellido').value = data.apellido || '';
        document.getElementById('fecha_nacimiento').value = data.fecha_nacimiento || '';
        document.getElementById('telefono').value = data.telefono || '';
        document.getElementById('direccion').value = data.direccion || '';
        document.getElementById('ciudad').value = data.ciudad || '';
        document.getElementById('provincia').value = data.provincia || '';
        document.getElementById('pais').value = data.pais || '';
        document.getElementById('codigo_postal').value = data.codigo_postal || '';

        const perfilForm = document.getElementById('perfilForm');

        perfilForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            const usuario = data.usuario;
            const email = data.email;
            const password = data.password;
            const nombre = document.getElementById('nombre').value.trim();
            const apellido = document.getElementById('apellido').value.trim();
            const fechaNacimiento = document.getElementById('fecha_nacimiento').value.trim();
            const telefono = document.getElementById('telefono').value.trim();
            const direccion = document.getElementById('direccion').value.trim();
            const ciudad = document.getElementById('ciudad').value.trim();
            const provincia = document.getElementById('provincia').value.trim();
            const pais = document.getElementById('pais').value.trim();
            const codigoPostal = document.getElementById('codigo_postal').value.trim();

            const errores = [];
                if (!nombre) {
                errores.push('El nombre es obligatorio.');
                }
                if (!apellido) {
                errores.push('El apellido es obligatorio.');
                }
                if (!fechaNacimiento) {
                errores.push('La fecha de nacimiento es obligatoria.');
                }
                if (!telefono) {
                errores.push('El teléfono es obligatorio.');
                }
                if (!direccion) {
                errores.push('La dirección es obligatoria.');
                }
                if (!ciudad) {
                errores.push('La ciudad es obligatoria.');
                }
                if (!provincia) {
                errores.push('La provincia es obligatoria.');
                }
                if (!pais) {
                errores.push('El país es obligatorio.');
                }
                if (!codigoPostal) {
                errores.push('El código postal es obligatorio.');
                }

                if (errores.length > 0) {
                alert(errores.join('\n'));

            } else {
                const dataToUpdate = {
                    usuario,
                    email,
                    password,
                    nombre,
                    apellido,
                    fecha_nacimiento: fechaNacimiento,
                    telefono,
                    direccion,
                    ciudad,
                    provincia,
                    pais,
                    codigo_postal: codigoPostal
                };

                const updateResponse = await fetch(`${BACKEND_URL}/api/users/usuario/update`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(dataToUpdate)
                });

                if (!updateResponse.ok) {
                    throw new Error('Error al guardar el perfil');
                }

                const result = await updateResponse.json();

                if (result.success) {
                    localStorage.setItem('token', result.token);
                    alert('Perfil guardado con éxito');
                    window.location.href = 'productos.html';
                } else {
                    throw new Error('Error al guardar el perfil');
                }
            }
        });


    } catch (error) {
        console.error('primer try en perfil : Error:', error);
        alert('Hubo un problema al cargar los datos del perfil. Por favor, inténtelo de nuevo más tarde.');
    }


});

