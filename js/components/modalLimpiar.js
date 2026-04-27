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
export async function prepararLimpieza(key) {
    let btnConfirm = document.getElementById('btn-confirm-limpiar')
    if (btnConfirm) {
            btnConfirm.onclick = () => {
                //Limpiar el localStorage con la key
                localStorage.setItem(key, JSON.stringify([]));
                //Cerrar el modal
                const container = document.getElementById('modal-container');
                if (container) container.innerHTML = '';

                window.location.reload();
            };
        }
}
