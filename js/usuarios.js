document.addEventListener('DOMContentLoaded', async function () {
    try {
        /* ---------------- Para mas adelante con Administrador ---------------
        const token = localStorage.getItem('token'); // Obtengo el token almacenado en localStorage
        
        if (!token) {// Verifico si el token existe
            alert('No estás autenticado. Por favor, inicia sesión.');
            window.location.href = 'login.html'; // Redirijo al login si no hay token
            return;
        }
        
        const headers = new Headers();// Configuro los headers para la solicitud con el token
        headers.append('Authorization', `Bearer ${token}`);
        */
        
        const response = await fetch('http://localhost:3000/api/users/', {// Realizo la solicitud al backend para obtener todos los usuarios
            method: 'GET',
            //headers: headers// Para admin
        });
        
        if (!response.ok) {
            throw new Error('Error al obtener los usuarios');
        }
        
        const data = await response.json();
        
        const usersTableBody = document.getElementById('usersTableBody');// Obtengo el cuerpo de la tabla donde se agregaran los usuarios
        usersTableBody.innerHTML = ''; // Limpia cualquier contenido previo
        
        data.result.forEach(user => {// Itera sobre los usuarios y crea las filas de la tabla data es el objeto recibido result la propiedad que es un array con los datos
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id_usuarios}</td>
                <td>${user.usuario}</td>
                <td>${user.email}</td>
                <td>${user.password}</td>
                <td>${user.nombre}</td>
                <td>${user.apellido}</td>
                <td>${user.fecha_nacimiento}</td>
                <td>${user.telefono}</td>
                <td>${user.direccion}</td>
                <td>${user.ciudad}</td>
                <td>${user.provincia}</td>
                <td>${user.pais}</td>
                <td>${user.codigo_postal}</td>
                <td>${user.rol}</td>
                <td>${user.status}</td>
                <td>
                    <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editUserModal">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            `;
            usersTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un problema al cargar los usuarios. Inténtalo de nuevo.');
    }
});
