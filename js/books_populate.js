
function splitOnWords(text) {
    const numberOfWords = 20;
    const words = text.split(' ');
    selectWords = words.slice(0, numberOfWords);
    return selectWords.join(' ');
}

// Función asincrónica para cargar la plantilla de tarjeta desde un archivo 'card.html'
async function loadCardTemplate() {
    const response = await fetch('card.html');
    if (!response.ok) {
        throw new Error('No se pudo cargar la plantilla de tarjeta');
    }
    return await response.text();
}

function renderButtons() {
    const buttonsContainer = document.getElementById('botones');
    buttonsContainer.innerHTML = ''; // Limpiar el contenedor de botones

    // Botones para administradores
    buttonsContainer.innerHTML = `
            <button id="addBookBtn" class="btn btn-primary mr-2">Agregar Libro</button>
            
        `;

}

// Función asincrónica para cargar el catálogo de libros desde el backend
async function loadCatalog(user) {
    try {

        const cardTemplate = await loadCardTemplate();
        const response = await fetch('http://localhost:3000/api/books');  // Reemplazar con la URL real de la API
        if (!response.ok) {
            throw new Error('Error al cargar el catálogo');
        }
        const data = await response.json();
        console.log(data);
        const books = data.result;


        const container = document.getElementById('books-container');  // Obtener el contenedor donde se añadirán las tarjetas
        books.forEach(book => {

            let cardHTML = cardTemplate
                .replace('{IMAGE_URL}', book.imagen)
                .replace('{BOOK_TITLE}', book.nombre)
                .replace('{BOOK_AUTHORS}', `${splitOnWords(book.descripcion)}....`)
                .replace('{BOOK_ISB}', ``)
                .replace('{BOOK_PRICE}', book.precio);

            const cardElement = document.createElement('div');
            cardElement.innerHTML = cardHTML;

            // Agregar la tarjeta al contenedor
            container.appendChild(cardElement.firstElementChild);
        });
    } catch (error) {
        console.error('Error:', error);
    }
    // if (user === 'admin') {
    //     console.log("Es admin!"); //Acá iría la versión del catálogo editable
    //     renderButtons();
    // }
}

// Cargar el catálogo cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', { passive: true }, function () {
    // Obtener el usuario desde el URL o desde el almacenamiento de sesiones, según sea necesario
    const urlParams = new URLSearchParams(window.location.search);
    const user = urlParams.get('user'); // Obtener el usuario del URL, ej. '?user=admin'

    loadCatalog(user || 'normal'); // Llamar a loadCatalog con el usuario obtenido o 'normal' por defecto
});