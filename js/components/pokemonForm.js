import { getPokemonByName, getPokemonById, getPokemonMin } from '../services/search.js';

const params = new URLSearchParams(window.location.search);
const pokemonSelected = params.get('name');

// 1. Seleccionamos el botón inmediatamente sin esperar a la API
console.log("--- TEST DE DIAGNÓSTICO ---");
const btnPrueba = document.getElementById('btn-open-modal');
console.log("¿El JS encontró el botón en el HTML?:", btnPrueba);
console.log("---------------------------");
const container = document.getElementById('modal-container');

// 2. Asignamos el evento click
btnPrueba.addEventListener('click', async () => {
    console.log("¡El evento funciona!");
    
    try {
        // 3. Cargamos el HTML del modal
        const response = await fetch('formulario.html'); // Asegúrate que la ruta sea correcta
        const htmlText = await response.text();
        container.innerHTML = htmlText;

        // 4. Recién ahora, pedimos los datos a la API (o usamos los que ya teníamos)
        const miPokemon = await getPokemonByName(pokemonSelected);
        imprimirPokemonModal(miPokemon); 

        setupModalLogic();
        saveModalLogic(); // Corregido el nombre (tenía 'c' en vez de 'g')
        setupPrioridad();

    } catch (error) {
        console.error("Error cargando el modal:", error);
    }
});

// Cambié el nombre de la función ligeramente para que no choque visualmente con la de pokemon.js
function imprimirPokemonModal(miPokemon) {
    document.getElementById('pokemonModal-title').textContent = ((miPokemon.name).charAt(0).toUpperCase() + (miPokemon.name).slice(1));
    document.getElementById('pokemonModal-id').textContent = `#${(miPokemon.id).toString().padStart(3, '0')}`;
    document.getElementById('pokemonModal-type').textContent = miPokemon.types['0'].type.name;
    document.getElementById('pokemonModal-img').src = miPokemon.sprites.other['official-artwork'].front_default;

    const statsMap = {
    'hp': 'pokemonModal-stats-hp',
    'attack': 'pokemonModal-stats-atk',
    'defense': 'pokemonModal-stats-def',
    'speed': 'pokemonModal-stats-speed'
    };
    
    miPokemon.stats.forEach(item => {
        const statName = item.stat.name;
        const baseValue = item.base_stat;
        const elementId = statsMap[statName];

        if (elementId) {
            const spanElement = document.getElementById(elementId);
            if(spanElement) spanElement.textContent = baseValue;
        }
    });
}

//--PRIORIDAD MODAL--
function setupPrioridad() {
    const starsContainer = document.getElementById('stars');
    const priorityInput = document.getElementById('f-priority');
    const priorityLabel = document.getElementById('priority-label');
    const stars = starsContainer.querySelectorAll('.star');

    const labels = {
        1: 'Muy Baja',
        2: 'Baja',
        3: 'Media',
        4: 'Alta',
        5: 'Muy Alta'
    };
    
    starsContainer.addEventListener('click', (e) => {
        const clickedStar = e.target.closest('.star');
        if (!clickedStar) return;

        const val = parseInt(clickedStar.getAttribute('data-val'));
        priorityInput.value = val;
        priorityLabel.textContent = labels[val];

        stars.forEach(star => {
            const starVal = parseInt(star.getAttribute('data-val'));
            if (starVal <= val) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    });
}

//--CERRAR MODAL--
function setupModalLogic() {
    // Eliminé 'const modal = document.getElementById('modal-pokemon');' porque no existía ese ID
    const btnClose = document.getElementById('btn-close');
    const btnCancel = document.getElementById('btn-cancel');

    const closeModal = () => {
        container.innerHTML = '';
    };

    if(btnClose) btnClose.addEventListener('click', closeModal);
    if(btnCancel) btnCancel.addEventListener('click', closeModal);
}

//--BOTON GUARDAR--
function saveModalLogic(){ // Nombre corregido
    const btnSave = document.getElementById('btn-save');
    
    if(!btnSave) return; // Evita errores si el botón no cargó
    
    btnSave.addEventListener('click', () => {
        const priority = document.getElementById('f-priority').value;
        const label = document.getElementById('f-label').value.trim();
        const note = document.getElementById('f-note').value.trim();
        
        const pokemonFavorito = {
            name: pokemonSelected,
            priority: parseInt(priority) || 0, // Fallback por si está vacío
            category: label,
            comment: note || "Sin nota"
        };
        
        console.log("Datos a guardar:", pokemonFavorito);
        saveToLocalStorage(pokemonFavorito);
        
        const btn = document.getElementById('btn-open-modal');
        btn.classList.add('active'); // Directamente le damos la clase
        
        container.innerHTML = ''; // Cerramos modal
    });
}

function saveToLocalStorage(pokemon) {
    const key = 'favoritos';
    const storedData = localStorage.getItem(key);
    let list = [];

    try {
        const parsedData = JSON.parse(storedData);
        if (Array.isArray(parsedData)) {
            list = parsedData;
        } else {
            console.warn("Se encontró data corrupta en LocalStorage, reseteando lista.");
        }
    } catch (error) {
        console.error("Error al leer LocalStorage:", error);
    }
    
    list.push(pokemon);
    localStorage.setItem(key, JSON.stringify(list));
}