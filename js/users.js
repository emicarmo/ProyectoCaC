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
                        <button class="btn btn-primary btn-sm" onclick="viewUser(${user.id_usuarios})" data-bs-toggle="modal" data-bs-target="#viewUserModal">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="deleteUser(${user.id_usuarios})">
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

// View User
async function viewUser(id) {
    const response = await fetch(`${usersEndpoint}/${id}`);
    const user = await response.json();
    user.result.forEach(user => {
        document.getElementById('viewUserID').innerText = `${user.id_usuarios}`;
        document.getElementById('viewUserUser').innerText = `${user.usuario}`;
        document.getElementById('viewUserEmail').innerText = `${user.email}`;
        document.getElementById('viewUserPass').innerText = `${user.password}`;
        document.getElementById('viewUserNombre').innerText = `${user.nombre}`;
        document.getElementById('viewUserUserName').innerText = `${user.apellido}`;
        document.getElementById('viewUserDate').innerText =  `${user.fecha_nacimiento}`;
        document.getElementById('viewUserTelephone').innerText = `${user.telefono}`;
        document.getElementById('viewUserAndrew').innerText = `${user.direccion}`;
        document.getElementById('viewUserCity').innerText = `${user.ciudad}`;
        document.getElementById('viewUserProvince').innerText = `${user.provincia}`;
        document.getElementById('viewUserCountry').innerText = `${user.pais}`;
        document.getElementById('viewUserPostalCode').innerText = `${user.codigo_postal}`;
        document.getElementById('viewUserRol').innerText = `${user.rol}`;
        document.getElementById('viewUserStatus').innerText = `${user.status}`;
    });

}

// Add a new user
/* document.getElementById('addUserForm').addEventListener('submit', async (e) =>{
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
}) */

// Delete User
async function deleteUser(id) {
    Swal.fire({
        title: `¿Esta seguro que desea eliminar el usuario con id: ${id}?`,
        text: "este cambio no sera reversible!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, Eliminarlo!"
    }).then((result) => {
        if (result.isConfirmed) {

            (async () => {
                const response = await fetch(`${usersEndpoint}/${id}`, {
                    method: 'DELETE'
                });


                if (response.ok) {
                    (async () => {
                        await fetchUsers();
                    })();
                }
            }
            )();

            Swal.fire({
                title: "Eliminado!",
                text: "El usuario ha sido eliminado",
                icon: "success"
            });
        }
    });
}

//Initialize
fetchUsers(); // Trae los usuarios

// Toggle btn
document.getElementById('toggle-btn').addEventListener('click', function () {
    document.getElementById('sidebar').classList.toggle('collapsed');
});