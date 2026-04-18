import { getPokemonMin,getPokemonById } from '../services/search.js';
import { getListPokemon } from '../services/pagination.js';

/*async function iniciarApp() {
    // Aquí SÍ esperamos a que la función termine de buscar en la API
    const pokemon = await getPokemonByName("charmander");
    const pokemon2 = await getPokemonById(4);
    
    // Ahora 'pokemon' es el objeto JSON, no la promesa
    console.log(pokemon); // Imprime: charmander
    console.log(pokemon2);
}
iniciarApp();*/
let offset = 0;
const limit = 12;

//--MAPEO DE POKEMONES--
async function mapPokemon(listPokemon) {
    try {
        const pokemonPromises = listPokemon.map(name => getPokemonMin(name));
        const listMapPokemon = await Promise.all(pokemonPromises);
        return listMapPokemon; 

    } catch (error) {
        console.error("Error al mapear pokemons:", error);
    }
}

//--IMPRESION DINAMICA DE POKEMONES EN PAANTALLA--
async function loadPokemon(offset) {
    let listapokemon = await getListPokemon(offset);
    let mapeoDePokemones = await mapPokemon(listapokemon);
    const hayMasPáginas = listapokemon.length === limit; 
    
    // 1. Seleccionamos el contenedor principal
    const sectionPrincipal = document.getElementById("pokedex");
    
    // 2. Limpiamos y creamos el grid (pokedex-grid) que envuelve a las cards
    sectionPrincipal.innerHTML = "";
    const pokedexGrid = document.createElement("div");
    pokedexGrid.classList.add("pokedex-grid");

    mapeoDePokemones.forEach(pokemon => {
        // --- Estructura de la Card ---
        const card = document.createElement("div");
        card.classList.add("pokemon-card", "glass-card");

        // --- Contenedor de Imagen (image-circle) ---
        const divImagenCircle = document.createElement("div");
        divImagenCircle.classList.add("image-circle");
        
        const imgPokemon = document.createElement("img");
        imgPokemon.src = pokemon[2]; // URL de la imagen
        imgPokemon.alt = pokemon[0]; // Nombre para el alt
        
        divImagenCircle.appendChild(imgPokemon);

        // --- Contenedor de Contenido (card-content) ---
        const divCardContent = document.createElement("div");
        divCardContent.classList.add("card-content");

        // ID del Pokemon
        const divId = document.createElement("div");
        divId.classList.add("pokemon-id");
        divId.textContent = `#${pokemon[1].toString().padStart(3, '0')}`;

        // Nombre del Pokemon
        const divNombre = document.createElement("div");
        divNombre.classList.add("pokemon-name");
        divNombre.textContent = pokemon[0];

        // Tipo del Pokemon
        const divTipo = document.createElement("div");
        divTipo.classList.add("pokemon-type");
        divTipo.innerHTML = `Tipo: <span class="type">Cargando...</span>`; 
        divTipo.innerHTML = `Tipo: <span class="type ${pokemon[3]}">${pokemon[3]}</span>`;

        // Ensamblamos el contenido de la card
        divCardContent.appendChild(divId);
        divCardContent.appendChild(divNombre);
        divCardContent.appendChild(divTipo);

        // --- Ensamblaje final de la Card ---
        card.appendChild(divImagenCircle);
        card.appendChild(divCardContent);

        // Agregamos la card al grid
        pokedexGrid.appendChild(card);
    });

    // Finalmente, metemos el grid en la sección
    sectionPrincipal.appendChild(pokedexGrid);
    
    updatePaginationUI(hayMasPáginas);
}

//--BOTONES DE PAGINAION--

const pageNumbersContainer = document.querySelector(".page-numbers");
const prevButton = document.getElementById("first_button");
const nextButton = document.getElementById("second_button");

async function updatePaginationUI(hasMoreData = true) {
    const currentPage = (offset / limit) + 1;

    // 1. Se limpia el contenedor
    pageNumbersContainer.innerHTML = "";

    // 2. Se muestra el rango anterior y siguiente de paginas
    for (let i = Math.max(1, currentPage - 1); i <= currentPage + 1; i++) {
        const btn = document.createElement("button");
        btn.classList.add("page-btn");
        if (i === currentPage) btn.classList.add("active");
        btn.textContent = i;
        
        btn.onclick = async() => {
            offset = (i - 1) * limit;
            await loadPokemon(offset);
        };
        pageNumbersContainer.appendChild(btn);
    }

    // 3. Control de botones Anterior/Siguiente
    prevButton.disabled = (offset === 0);
    nextButton.disabled = !hasMoreData;
}

// Eventos para tus botones actuales
prevButton.addEventListener("click", async () => {  
    if(offset >= 12){
        offset = offset-12;
        await loadPokemon(offset);
        updatePaginationUI();
    }
});

nextButton.addEventListener("click", async () => {  
    if(offset >= 0){
        offset = offset+12;
        await loadPokemon(offset);
        updatePaginationUI();
    }
});

updatePaginationUI();
await loadPokemon(offset);