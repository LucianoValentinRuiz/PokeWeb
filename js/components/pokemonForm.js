import { getPokemonByName, getPokemonById, getPokemonMin } from '../services/search.js';

const params = new URLSearchParams(window.location.search);
const pokemonSelected = params.get('name');

const btnAbrir = document.getElementById('btn-open-modal');
const container = document.getElementById('modal-container');

//--EVENTO AL BOTON AGREGAR--
btnAbrir.addEventListener('click', async () => {
    try {
        //Se carga el HTML del modal
        const response = await fetch('formulario.html');
        const htmlText = await response.text();
        container.innerHTML = htmlText;
        const miPokemon = await getPokemonByName(pokemonSelected);
        imprimirPokemonModal(miPokemon); 

        setupModalLogic();
        saveModalLogic();
        setupPrioridad();

    } catch (error) {
        console.error("Error cargando el modal:", error);
    }
});

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
    const btnClose = document.getElementById('btn-close');
    const btnCancel = document.getElementById('btn-cancel');

    const closeModal = () => {
        container.innerHTML = '';
    };

    if(btnClose) btnClose.addEventListener('click', closeModal);
    if(btnCancel) btnCancel.addEventListener('click', closeModal);
}

//--BOTON GUARDAR--
function saveModalLogic() {
    const btnSave = document.getElementById('btn-save');
    
    if (!btnSave) return;

    btnSave.addEventListener('click', () => {
        // 1. Capturar elementos y valores
        const priorityInput = document.getElementById('f-priority');
        const labelInput = document.getElementById('f-label');
        const noteInput = document.getElementById('f-note');
        
        const errorPriority = document.getElementById('e-priority');
        const errorLabel = document.getElementById('e-label');

        const priority = priorityInput.value;
        const label = labelInput.value.trim();
        const note = noteInput.value.trim();

        let esValido = true;
        if (!priority) {
            errorPriority.style.display = 'block';
            esValido = false;
        } else {
            errorPriority.style.display = 'none';
        }

        if (label.length < 2) {
            errorLabel.style.display = 'block';
            esValido = false;
        } else {
            errorLabel.style.display = 'none';
        }

        if (!esValido) return;

        const pokemonFavorito = {
            name: pokemonSelected,
            priority: parseInt(priority),
            category: label,
            comment: note || "Sin nota"
        };
        
        console.log("Datos a guardar:", pokemonFavorito);
        saveToLocalStorage(pokemonFavorito);
        
        const btn = document.getElementById('btn-open-modal');
        btn.classList.add('active');
        
        container.innerHTML = ''; // Cerrar modal
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