const baseUrl ='http://localhost:3000/api'; 
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
                        <button class="btn btn-primary btn-sm"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-danger btn-sm" onclick="deleteBook(${book.id_libros})"><i class="fas fa-trash-alt"></i></button>
                    </td>
                `;
        booksTableBody.appendChild(tr);
    });
}

// Fetch all categories to fill select field
async function fetchCategories(){
    const response = await fetch(categoriesEndpoint);
    const data = await response.json();
    return data;
}

async function fillCategoriesOnAddBookModal(){
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

// Add a new book
document.getElementById('addBookForm').addEventListener('submit', async(e)=>{
    e.preventDefault();

    const formData = new FormData(e.target);
    const response = await fetch(booksEndpoint, {
        method: 'POST',
        body: formData
    });

    if(response.ok){
        Swal.fire({
            title: "Libro creado",
            text: "El libro ha sido guardado correctamente",
            icon: "success"
          }).then(()=>{
              fetchBooks();
              document.querySelector('#addBookModal .btn-close').click();
              document.getElementById('image-preview').style.display = 'none';
              e.target.reset();
          });
    }else{
        Swal.fire({
            title: "Error",
            text: `ah ocurrido algun error`,
            icon: "error"
          });

        console.log(await response.json());
    }
});
// Preview Image loaded
document.getElementById('bookImage').addEventListener('change', function(){
    const file = this.files[0];
    if(file){
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('image-preview').src = e.target.result;
            document.getElementById('image-preview').style.display = 'block';
        }
        reader.readAsDataURL(file);
    }else{
        document.getElementById('image-preview').src = '';
        document.getElementById('image-preview').style.display = 'none';
    }
});

// View book details
async function viewBook(id) {
    const response = await fetch(`${booksEndpoint}/${id}`);
    const book = await response.json();
    console.log(book);

    document.getElementById('viewBookID').innerText = `ID: ${book.id_libros}`;
    document.getElementById('viewBookName').innerText = `Nombre: ${book.nombre}`;
    document.getElementById('viewBookCategory').innerText = `Categoría: ${book.categoria}`;
    document.getElementById('viewBookPublisher').innerText = `Editorial: ${book.editorial}`;
    document.getElementById('viewBookPrice').innerText = `Precio: ${formatCurrency(book.precio)}`;
    document.getElementById('viewBookStock').innerText = `Stock: ${book.stock}`;
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
            
        (async () =>{
            const response = await fetch(`${booksEndpoint}/${id}`, {
                method: 'DELETE'
            });
    
            if (response.ok) {
                (async()=>{
                    await fetchBooks();
                })();
            }}
        )();

            Swal.fire({
            title: "Eliminado!",
            text: "El libro ha sido eliminado",
            icon: "success"
          });
        }
      });
}

function formatCurrency(value){
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS'
    }).format(value);
}

// Initialize
fetchBooks();
fillCategoriesOnAddBookModal();

document.getElementById('toggle-btn').addEventListener('click', function () {
    document.getElementById('sidebar').classList.toggle('collapsed');
});