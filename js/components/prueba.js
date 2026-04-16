import { getPokemonByName,getPokemonById } from '../services/search.js';
import { getListPokemon } from '../services/pagination.js';

async function iniciarApp() {
    // Aquí SÍ esperamos a que la función termine de buscar en la API
    const pokemon = await getPokemonByName("charmander");
    const pokemon2 = await getPokemonById(4);
    
    // Ahora 'pokemon' es el objeto JSON, no la promesa
    console.log(pokemon); // Imprime: charmander
    console.log(pokemon2);
}

//iniciarApp();

async function mapPokemon(listPokemon) {
    try {
        const pokemonPromises = listPokemon.map(name => getPokemonByName(name));
        const listMapPokemon = await Promise.all(pokemonPromises);
        return listMapPokemon; 

    } catch (error) {
        console.error("Error al mapear pokemons:", error);
    }
}

async function loadPokemon(offset) {
    let listapokemon = await getListPokemon(offset);
    let mapeoDePokemones = await mapPokemon(listapokemon);
    console.log(mapeoDePokemones);
    const sectionPrincipal = document.getElementById("prueba");
    // Limpiamos la sección antes de cargar nuevos
    sectionPrincipal.innerHTML = "";

    mapeoDePokemones.forEach(pokemon => {
        // 1. Crear el contenedor principal (article)
        const article = document.createElement("article");
        article.classList.add("pokemon-card"); // Una clase para tus CSS

        // 2. Div para el Nombre
        const divNombre = document.createElement("div");
        const linkNombre = document.createElement("a");
        linkNombre.textContent = pokemon[0]; // El nombre
        divNombre.appendChild(linkNombre);

        // 3. Div para el ID
        const divId = document.createElement("div");
        const linkId = document.createElement("a");
        linkId.textContent = `${pokemon[1]}`; // El ID
        divId.appendChild(linkId);

        // 4. Div para la Imagen
        const divImagen = document.createElement("div");
        const imgPokemon = document.createElement("img");
        imgPokemon.src = pokemon[2]; // La URL de la imagen
        imgPokemon.alt = pokemon[0];
        divImagen.appendChild(imgPokemon);

        // 5. Armar la estructura: Meter los divs en el article
        article.appendChild(divNombre);
        article.appendChild(divId);
        article.appendChild(divImagen);

        // 6. Meter el article en la sección principal del HTML
        sectionPrincipal.appendChild(article);
    });
}

await loadPokemon(20);