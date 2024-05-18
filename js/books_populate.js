function generatePrice(max, min){
    return (Math.random() * (max - min) + min).toFixed(0);
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
        const response = await fetch('https://www.dbooks.org/api/recent');  // Reemplaza con la URL real de la API
        if (!response.ok) {
            throw new Error('Error al cargar el catálogo');
        }
        const data = await response.json();
        const books = data.books;

        const container = document.getElementById('books-container');
        books.forEach(book => {
            let price = generatePrice(8500, 2000);
            let cardHTML = cardTemplate
                .replace('{IMAGE_URL}', book.image)
                .replace('{BOOK_TITLE}', book.title)
                .replace('{BOOK_AUTHORS}', book.authors)
                .replace('{BOOK_ISB}', book.id)
                .replace('{BOOK_PRICE}', price);

            const cardElement = document.createElement('div');
            cardElement.innerHTML = cardHTML;
            container.appendChild(cardElement.firstElementChild);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadCatalog);