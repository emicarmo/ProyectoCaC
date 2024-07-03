const apiUrl = 'http://localhost:3000/api/books';

// Fetch all books and display in the table
async function fetchBooks() {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const booksTableBody = document.getElementById('booksTableBody');
    booksTableBody.innerHTML = '';

    data.result.forEach(book => {
        console.log(book);
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

// View book details
async function viewBook(id) {
    const response = await fetch(`${apiUrl}/${id}`);
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
    const response = await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        fetchBooks();
    }
}

function formatCurrency(value){
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS'
    }).format(value);
}

// Initialize
fetchBooks();

document.getElementById('toggle-btn').addEventListener('click', function () {
    document.getElementById('sidebar').classList.toggle('collapsed');
});