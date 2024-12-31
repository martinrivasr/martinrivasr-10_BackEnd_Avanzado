// Mostrar el spinner
// Función para mostrar el spinner
function showSpinner() {
    const spinner = document.getElementById('spinner');
    if (spinner) {
        spinner.classList.remove('hidden');
        spinner.style.display = 'flex';
    }
}

// Función para ocultar el spinner

function hideSpinner() {
    const spinner = document.getElementById('spinner');
    if (spinner) {
        spinner.classList.add('hidden'); 
        setTimeout(() => {
            spinner.style.display = 'none';
        }, 1000); 
    }
}


// Función para cambiar de página
function goToPage(page) {
    showSpinner(); //
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('page', page);
    window.location.search = urlParams.toString();
}

window.goToPage = goToPage;

// Actualizar paginacion
function updatePagination() {
    showSpinner(); //
    const limit = document.getElementById('records-per-page').value;
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('limit', limit);
    urlParams.set('page', 1);
    window.location.search = urlParams.toString();
}
window.updatePagination = updatePagination;

// actualizar el sort
function updateSorting() {
    showSpinner(); //
    const sort = document.getElementById('sort').value;
    const direction = document.getElementById('direction').value;
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('sort', sort);
    urlParams.set('direction', direction);
    urlParams.set('page', 1);
    window.location.search = urlParams.toString();
}
window.updateSorting = updateSorting;


export { updatePagination, goToPage, updateSorting, showSpinner, hideSpinner };
