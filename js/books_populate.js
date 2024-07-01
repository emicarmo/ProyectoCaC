function splitOnWords(text){
    const numberOfWords = 20;
    const words = text.split(' ');
    selectWords = words.slice(0, numberOfWords);
    return selectWords.join(' ');
}

async function loadCardTemplate() {
    const response = await fetch('card.html');
    if (!response.ok) {
        throw new Error('No se pudo cargar la plantilla de tarjeta');
    }
    return await response.text();
}


async function loadCatalog() {
    try {
        const cardTemplate = await loadCardTemplate();
        const response = await fetch('http://localhost:5000/api/books');  // Reemplazar con la URL real de la API
        if (!response.ok) {
            throw new Error('Error al cargar el catálogo');
        }
        const data = await response.json();
        console.log(data);
        const books = data.result;

        const container = document.getElementById('books-container');
        books.forEach(book => {
            let cardHTML = cardTemplate
                .replace('{IMAGE_URL}', book.imagen)
                .replace('{BOOK_TITLE}', book.nombre)
                .replace('{BOOK_AUTHORS}', `${splitOnWords(book.descripcion)}....`)
                .replace('{BOOK_ISB}', `ISBN: ${book.id}`)
                .replace('{BOOK_PRICE}', book.precio);

            const cardElement = document.createElement('div');
            cardElement.innerHTML = cardHTML;
            container.appendChild(cardElement.firstElementChild);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadCatalog);