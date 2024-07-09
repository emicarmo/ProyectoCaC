const baseUrl = 'http://localhost:3000/api';
const usersEndpoint = `${baseUrl}/users`;

// Fetch all users
async function fetchUsers() {
    try {
        const response = await fetch(usersEndpoint);
        const data = await response.json();
        const userTableBody = document.getElementById('usersTableBody');
        userTableBody.innerHTML = '';

        data.result.forEach(user => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
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
            userTableBody.appendChild(tr);
        });
    }
    catch (error){
        console.error('Error:', error);
        alert('Hubo un problema al cargar los usuarios. Inténtalo de nuevo.');
    }
    
}

// Add a new user
document.getElementById('addUserForm').addEventListener('submit', async (e) =>{
    e.preventDefault();

    const formData = new FormData(e.target);
    const response = await fetch(`${usersEndpoint}/usuario/register`, {
        method: 'POST',
        body: formData
    })

    if (response.ok) {
        Swal.fire({
            title: "Usuario creado",
            text: "El usuario ha sido guardado correctamente",
            icon: "success"
        }).then(async()=>{
            await fetchUsers();
        })
        document.querySelector('#addUserModal .btn-close').click();
        e.target.reset();
    } else {
        Swal.fire({
            title: "Error",
            text: `ah ocurrido algun error`,
            icon: "error"
        });

        console.log(await response.json());
    }
})


//Initialize
fetchUsers(); // Trae los usuarios

// Toggle btn
document.getElementById('toggle-btn').addEventListener('click', function () {
    document.getElementById('sidebar').classList.toggle('collapsed');
});