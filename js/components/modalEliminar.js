// 1. Variables globales para "recordar" qué queremos borrar
let pokemonABorrar = null;
let keyDeOrigen = "";

//Funcion imprimir modal
export async function imprimirPokemonModal(nombre,id,img) {
    document.getElementById('pokemonModal-title').textContent = ((nombre).charAt(0).toUpperCase() + (nombre).slice(1));
    document.getElementById('pokemonModal-id').textContent = `#${(id).toString().padStart(3, '0')}`;
    document.getElementById('pokemonModal-img').src = img;
    document.getElementById('strongName').textContent = ((nombre).charAt(0).toUpperCase() + (nombre).slice(1));
}

//--CERRAR MODAL--
export async function botonCerrarModal() {
    const container = document.getElementById('modal-container');
    const btnClose = document.getElementById('btn-close');
    const btnCancel = document.getElementById('btn-cancel');

    const closeModal = () => {
        container.innerHTML = '';
    };

    if(btnClose) btnClose.addEventListener('click', closeModal);
    if(btnCancel) btnCancel.addEventListener('click', closeModal);
}

//--BOTON ELIMINAR--
export async function prepararEliminacion(nombre, key) {
    pokemonABorrar = nombre;
    keyDeOrigen = key;
    document.getElementById('btn-confirm-delete').addEventListener('click', async () => {
    if (!pokemonABorrar || !keyDeOrigen) return;
    // Lógica de localStorage
    const storedData = localStorage.getItem(keyDeOrigen);
    if (storedData) {
        let list = JSON.parse(storedData);
        //usamos la variable global 'pokemonABorrar'
        const nuevaLista = list.filter(pokemon => pokemon.name !== pokemonABorrar);
        localStorage.setItem(keyDeOrigen, JSON.stringify(nuevaLista));
    }
    // Cerrar modal y limpiar
    const container = document.getElementById('modal-container');
    container.innerHTML = '';
    window.location.href = window.location.href;
});
}
