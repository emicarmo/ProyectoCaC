
function splitOnWords(text) {
    const numberOfWords = 20;
    const words = text.split(' ');
    const selectWords = words.slice(0, numberOfWords);
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

// Función asincrónica para cargar el catálogo de libros desde el backend
async function loadCatalog() {
    try {
        const cardTemplate = await loadCardTemplate();
        console.log('Card template loaded:', cardTemplate);

        const response = await fetch('http://localhost:3000/api/books');  // Reemplazar con la URL real de la API
        if (!response.ok) {
            throw new Error('Error al cargar el catálogo');
        }
        const data = await response.json();
        console.log('Data received:', data);
        const books = data.result;

        const container = document.getElementById('books-container');  // Obtener el contenedor donde se añadirán las tarjetas
        if (!container) {
            throw new Error('Contenedor "books-container" no encontrado');
        }

        books.forEach(book => {
            let cardHTML = cardTemplate
                .replace('{IMAGE_URL}', book.imagen)
                .replace('{BOOK_TITLE}', book.nombre)
                .replace('{BOOK_AUTHORS}', `${splitOnWords(book.descripcion)}....`)
                .replace('{BOOK_ISB}', '') // Si hay un valor de ISB, reemplazar aquí
                .replace('{BOOK_PRICE}', book.precio);

            const cardElement = document.createElement('div');
            cardElement.innerHTML = cardHTML;
            console.log('Card HTML:', cardHTML);

            // Agregar la tarjeta al contenedor
            container.appendChild(cardElement.firstElementChild);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

// Cargar el catálogo cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function () {
    loadCatalog();
});