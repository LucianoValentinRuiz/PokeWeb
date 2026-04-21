import { getPokemonByName, getPokemonById, getPokemonMin } from '../services/search.js';
import { botonActive } from './pokemon.js';

const params = new URLSearchParams(window.location.search);
const pokemonSelected = params.get('name');

console.log(pokemonSelected);

const miPokemon = await getPokemonByName(pokemonSelected);

async function imprimirPokemon(miPokemon) {
    document.getElementById('pokemonModal-title').textContent = ((miPokemon.name).charAt(0).toUpperCase() + (miPokemon.name).slice(1));
    document.getElementById('pokemonModal-id').textContent = `#${(miPokemon.id).toString().padStart(3, '0')}`;;
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
        spanElement.textContent = baseValue;
        }
    });
};

//--ABRIR MODAL--
const btnOpen = document.getElementById('btn-open-modal');
const container = document.getElementById('modal-container');

btnOpen.addEventListener('click', async () => {
    try {
        const response = await fetch('formulario.html');
        const htmlText = await response.text();
        container.innerHTML = htmlText;

        setupModalLogic();
        saveModalLocic();
        await imprimirPokemon (miPokemon);
        setupPrioridad()

        
    } catch (error) {
        console.error("Error cargando el modal:", error);
    }
});

//--PRIORIDAD MODAL--
function setupPrioridad() {
    const starsContainer = document.getElementById('stars');
    const priorityInput = document.getElementById('f-priority');
    const priorityLabel = document.getElementById('priority-label');
    const stars = starsContainer.querySelectorAll('.star');

    // Diccionario para los textos de prioridad
    const labels = {
        1: 'Muy Baja',
        2: 'Baja',
        3: 'Media',
        4: 'Alta',
        5: 'Muy Alta'
    };
    //evento al clickear una estrella
    starsContainer.addEventListener('click', (e) => {
        const clickedStar = e.target.closest('.star');
        if (!clickedStar) return;

        const val = parseInt(clickedStar.getAttribute('data-val'));

        // valor de prioridad
        priorityInput.value = val;

        //c ambiamos el texto del label
        priorityLabel.textContent = labels[val];

        // le agregamos o removemos la clase active a las estrellas
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
    const modal = document.getElementById('modal-pokemon');
    const btnClose = document.getElementById('btn-close');
    const btnCancel = document.getElementById('btn-cancel');

    const closeModal = () => {
        container.innerHTML = '';
    };

    btnClose.addEventListener('click', closeModal);
    btnCancel.addEventListener('click', closeModal);
}

//--BOTON GUARDAR--
function saveModalLocic(){
    const btnSave = document.getElementById('btn-save');
    btnSave.addEventListener('click', () => {
        const priority = document.getElementById('f-priority').value;
        const label = document.getElementById('f-label').value.trim();
        const note = document.getElementById('f-note').value.trim();
        const pokemonFavorito = {
            name: pokemonSelected,
            priority: parseInt(priority),
            category: label,
            comment: note || "Sin nota"
        };
        console.log("Datos a guardar:", pokemonFavorito);
        //lo guardp en el localStorage
        saveToLocalStorage(pokemonFavorito);
        //le doy la clase active al boton
        const btn = document.getElementById('btn-open-modal');
        btn.addEventListener('click', () => { btn.classList.add('active');});
        botonActive();
        container.innerHTML = '';
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
            list = [];
        }
    } catch (error) {
        console.error("Error al leer LocalStorage:", error);
        list = [];
    }
    list.push(pokemon);
    localStorage.setItem(key, JSON.stringify(list));
}