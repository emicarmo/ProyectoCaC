// Función para generar un precio aleatorio dentro de un rango específico
function generatePrice(max, min) {
    return (Math.random() * (max - min) + min).toFixed(0);
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
        
        const cardTemplate = await loadCardTemplate(); // Cargamos la plantilla de tarjeta
        const response = await fetch('https://www.dbooks.org/api/recent');  // Hacer la solicitud al backend
        if (!response.ok) {
            throw new Error('Error al cargar el catálogo');
        }
        const data = await response.json();  // Convertir la respuesta a JSON
        const books = data.books;  // Obtener el array de libros desde la respuesta

        const container = document.getElementById('books-container');  // Obtener el contenedor donde se añadirán las tarjetas
        books.forEach(book => {
            let price = generatePrice(8500, 2000);  // Generar un precio aleatorio para cada libro (simulado)

            // Reemplazar los marcadores de posición en la plantilla con los datos del libro actual
            let cardHTML = cardTemplate
                .replace('{IMAGE_URL}', book.image)
                .replace('{BOOK_TITLE}', book.title)
                .replace('{BOOK_AUTHORS}', book.authors)
                .replace('{BOOK_ISB}', book.id)
                .replace('{BOOK_PRICE}', price);
            
                if (user === 'admin') {
                    console.log("Es admin!"); //Acá iría la versión del catálogo editable
                    renderButtons();
                    cardHTML = cardHTML.replace('<div class="mt-4 botones">', '<div class="mt-4 botones"><button id="editBookBtn" class="btn btn-secondary mr-2">Editar Libro</button><button id="deleteBookBtn" class="btn btn-danger">Eliminar Libro</button>');
                }

            // Crear un elemento div para la tarjeta y asignarle el HTML generado
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
document.addEventListener('DOMContentLoaded', function () {
    // Obtener el usuario desde el URL o desde el almacenamiento de sesiones, según sea necesario
    const urlParams = new URLSearchParams(window.location.search);
    const user = urlParams.get('user'); // Obtener el usuario del URL, ej. '?user=admin'

    loadCatalog(user || 'normal'); // Llamar a loadCatalog con el usuario obtenido o 'normal' por defecto
});