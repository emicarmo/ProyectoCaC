const serverUrl = 'http://34.46.27.106:3000';
const baseUrl = `${serverUrl}/api`;
const booksEndpoint = `${baseUrl}/books`;
const categoriesEndpoint = `${baseUrl}/categories`;

// Fetch all books and display in the table
async function fetchBooks() {
    const response = await fetch(booksEndpoint);
    const data = await response.json();
    const booksTableBody = document.getElementById('booksTableBody');
    booksTableBody.innerHTML = '';

    data.result.forEach(book => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
                    <td>${book.id_libros}</td>
                    <td>${book.nombre}</td>
                    <td>${book.categoria}</td>
                    <td>${book.editorial}</td>
                    <td>${formatCurrency(book.precio)}</td>
                    <td>${book.stock}</td>
                    <td>
                        <button class="btn btn-primary btn-sm" onclick="viewBook(${book.id_libros})" data-bs-toggle="modal" data-bs-target="#viewBookModal">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button data-id="${book.id_libros}" class="btn btn-warning btn-sm editar-btn" >
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="deleteBook(${book.id_libros})">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
                `;
        booksTableBody.appendChild(tr);
    });
}

// Fetch all categories to fill select field
async function fetchCategories() {
    const response = await fetch(categoriesEndpoint);
    const data = await response.json();
    return data;
}

async function fillCategoriesOnAddBookModal() {
    const data = await fetchCategories();
    const bookCategorySelect = document.getElementById('addBookCategory');
    bookCategorySelect.innerHTML = '';

    data.result.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id_categoria;
        option.text = category.nombre_cat;
        bookCategorySelect.appendChild(option);
    });
}

async function fillCategoriesOnEditBookModal() {
    const data = await fetchCategories();
    const bookCategorySelect = document.getElementById('editBookCategory');
    bookCategorySelect.innerHTML = '';

    data.result.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id_categoria;
        option.text = category.nombre_cat;
        bookCategorySelect.appendChild(option);
    });
}

/* async function fillCategoriesOnAddBookModal() {
    const categorias = await fetchCategories();
    const cargarCategorias = (selectElement) =>{
        categorias.result.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id_categoria; // Obtenemos el id
            option.textContent = category.nombre_cat; // Obtenemos el nombre
            selectElement.appendChild(option);
        });
    }
    // Carga las categorias en ambos select
    cargarCategorias(document.getElementById('editBookCategory'));
    cargarCategorias(document.getElementById('addBookCategory'));
} */

// Edit a Book


async function cargarFormEdit(id) {
    try{
        const respuesta = await fetch(`${booksEndpoint}/${id}`, {
            method: 'GET'
        })

        if (!respuesta.ok){
            throw new Error('Error al obtener los datos del libro')
        }

        const libro = await respuesta.json();
        const categories = await fetchCategories();
        
        //console.log(categories);
        
        const selectCategorias = document.getElementById('editBookCategory1');
        selectCategorias.innerHTML = '';
        categories.result.forEach(categorie =>{
            const option = document.createElement('option');
            option.value = categorie.id_categoria;
            option.text = categorie.nombre_cat;
            if (option.value == libro.categoria_id){
                option.setAttribute('selected', 'selected')
            }
            selectCategorias.appendChild(option);
        })

        document.getElementById('editar-id').value = libro.id_libros
        document.getElementById('bookTitle1').value = libro.nombre
        document.getElementById('bookEditorial1').value = libro.editorial
        document.getElementById('bookPrice1').value = parseFloat(libro.precio) 
        document.getElementById('bookStock1').value = libro.stock
        document.getElementById('bookDescription1').value = libro.descripcion

        // Load image book preview
        const imagePreview = document.getElementById('image-preview-edit');
        if (libro.imagen) {
            imagePreview.src = libro.imagen;
            imagePreview.style.display = 'block';
        } else {
            imagePreview.style.display = 'none';
        }
        const modal = document.getElementById('editBookModal');
        const modalBootstrap = new bootstrap.Modal(modal);
        modalBootstrap.show();
    }catch(error){
        console.error('Error al cargar los datos del libro', error);
    }
}
document.getElementById('editBookForm').addEventListener('submit', async (e) => {
    e.preventDefault();


    const id = document.getElementById('editar-id').value;
    // const id_libro = document.getElementById('editar-id');
    //const id = id_libro ? id_libro.value : null;
    const titulo = document.getElementById('bookTitle1').value;
    const selectCategorias = document.getElementById('editBookCategory1');
    const categorias = Array.from(selectCategorias.selectedOptions).map(option => option.value);
    const editorial = document.getElementById('bookEditorial1').value;
    const precio = document.getElementById('bookPrice1').value;
    const stock = document.getElementById('bookStock1').value;
    const descripcion = document.getElementById('bookDescription1').value;
    const imagen = document.getElementById('editBookImage').files[0];

    //Debugging: Print values to console
    // console.log({
    //     id,
    //     titulo,
    //     categorias,
    //     editorial,
    //     precio,
    //     stock,
    //     descripcion,
    //     imagen
    // });

    const formData = new FormData();
    //formData.append('id', id)
    formData.append('nombre', titulo);
    formData.append('editorial', editorial);
    formData.append('precio', parseInt(precio));
    formData.append('categoria_id', selectCategorias.value);
    formData.append('stock', parseInt(stock));
    formData.append('descripcion', descripcion);
    if (imagen) {
        formData.append('imagen', imagen);
    }

    try {
        const response = await fetch(`${booksEndpoint}/${id}`, {
            method: 'PUT',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });


        // Log the response status and body
        console.log('Response status:', response.status);
        const responseBody = await response.text();
        console.log('Response body:', responseBody);

        if (response.ok) {
            Swal.fire({
                title: "Libro modificado",
                text: "El libro ha sido modificado correctamente",
                icon: "success"
            }).then(async() => {
                await fetchBooks().then(async() => {
                    await addEventEdit();
                });
                document.querySelector('#editBookModal .btn-close').click();
                document.getElementById('image-preview-edit').style.display = 'none';
                e.target.reset();
            });
        } else {
            Swal.fire({
                title: "Error",
                text: `Ha ocurrido un error: ${responseBody}`,
                icon: "error"
            });
            console.error('Error:', responseBody);
        }
    } catch (error) {
        Swal.fire({
            title: "Error",
            text: `Error en la solicitud: ${error.message}`,
            icon: "error"
        });
        console.error('Error:', error);
    }
});

// Add a new book
document.getElementById('addBookForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const response = await fetch(booksEndpoint, {
        method: 'POST',
        body: formData
    });

    if (response.ok) {
        Swal.fire({
            title: "Libro creado",
            text: "El libro ha sido guardado correctamente",
            icon: "success"
        }).then(() => {
            fetchBooks().then(()=>{
                addEventEdit();
            })
            document.querySelector('#addBookModal .btn-close').click();
            document.getElementById('image-preview').style.display = 'none';
            e.target.reset();
        });
    } else {
        Swal.fire({
            title: "Error",
            text: `ah ocurrido algun error`,
            icon: "error"
        });

        console.log(await response.json());
    }
});

// Preview Image loaded
document.getElementById('bookImage').addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('image-preview').src = e.target.result;
            document.getElementById('image-preview').style.display = 'block';
        }
        reader.readAsDataURL(file);
    } else {
        document.getElementById('image-preview').src = '';
        document.getElementById('image-preview').style.display = 'none';
    }
});

document.getElementById('editBookImage').addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('image-preview-edit').src = e.target.result;
            document.getElementById('image-preview-edit').style.display = 'block'
        }
        reader.readAsDataURL(file);
    } else {
        document.getElementById('image-preview-edit').src = '';
        document.getElementById('image-preview-edit').style.display = 'none';
    }
});

// View book details
async function viewBook(id) {
    const response = await fetch(`${booksEndpoint}/${id}`);
    const book = await response.json();
    console.log(book);

    document.getElementById('viewBookID').innerText = `${book.id_libros}`;
    document.getElementById('viewBookName').innerText = `${book.nombre}`;
    document.getElementById('viewBookCategory').innerText = `${book.categoria}`;
    document.getElementById('viewBookPublisher').innerText = `${book.editorial}`;
    document.getElementById('viewBookPrice').innerText = `${formatCurrency(book.precio)}`;
    document.getElementById('viewBookStock').innerText = `${book.stock}`;
    document.getElementById('viewBookDescription').innerText = book.descripcion;
    document.getElementById('viewBookImage').src = book.imagen;
}

// Delete book
async function deleteBook(id) {
    Swal.fire({
        title: `¿Esta seguro que desea eliminar el registro con id: ${id}?`,
        text: "este cambio no sera reversible!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, Eliminarlo!"
    }).then((result) => {
        if (result.isConfirmed) {

            (async () => {
                const response = await fetch(`${booksEndpoint}/${id}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    (async () => {
                        await fetchBooks();
                    })();
                }
            }
            )();

            Swal.fire({
                title: "Eliminado!",
                text: "El libro ha sido eliminado",
                icon: "success"
            });
        }
    });
}

function formatCurrency(value) {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS'
    }).format(value);
}

// Initialize
function addEventEdit() {
    document.querySelectorAll('.editar-btn').forEach(boton => {
        boton.addEventListener('click', async (e) => {
            console.log(boton);
            const id = boton.getAttribute('data-id');
            console.log(id);
            await cargarFormEdit(id);
        })
    });
}
fetchBooks().then(() => {
    addEventEdit()
});
fillCategoriesOnAddBookModal();

document.getElementById('toggle-btn').addEventListener('click', function () {
    document.getElementById('sidebar').classList.toggle('collapsed');
});