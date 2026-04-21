import { getPokemonByName, getPokemonById, getPokemonMin } from '../services/search.js';

const params = new URLSearchParams(window.location.search);
const pokemonSelected = params.get('name');

console.log(pokemonSelected);

const miPokemon = await getPokemonByName(pokemonSelected);
const miPokemonBio = await getPokemonById(pokemonSelected);

async function imprimirPokemon(miPokemon, miPokemonBio) {
    // 1. INFO DEL POKEMON
    document.getElementById('pokemon-title').textContent = ((miPokemon.name).charAt(0).toUpperCase() + (miPokemon.name).slice(1));
    document.getElementById('pokemon-id').textContent = `#${(miPokemon.id).toString().padStart(3, '0')}`;;
    document.getElementById('pokemon-type').textContent = miPokemon.types['0'].type.name;
    document.getElementById('pokemon-img').src = miPokemon.sprites.other['official-artwork'].front_default;

    //2.STATS DEL POKEMON
    document.getElementById('pokemon-info-altura').textContent =`${(miPokemon.height/10)} m`;
    document.getElementById('pokemon-info-peso').textContent = `${(miPokemon.weight/10)} kg`;
    document.getElementById('pokemon-info-exp').textContent = `${(miPokemon.base_experience)} xp`;

    //3.DESCRIPCION DEL POKEMON
    if (miPokemonBio && miPokemonBio.flavor_text_entries) {
    let descripcion = miPokemonBio.flavor_text_entries.find(entry => entry.language.name === 'es');
    if (!descripcion) {
        descripcion = miPokemonBio.flavor_text_entries.find(entry => entry.language.name === 'en');
    }
    if (descripcion) {
        const descPokemon = document.getElementById('pokemon-description');
        const descripcionLimpia = descripcion.flavor_text.replace(/[\n\f\r]/g, ' ');
        descPokemon.textContent = descripcionLimpia;
    } else {
        const descPokemon = document.getElementById('pokemon-description');
        const descripcionLimpia = miPokemonBio.flavor_text_entries['0'].flavor_text;
        descPokemon.textContent = descripcionLimpia;
    }
    
    } else {
        console.error("No se encontró la base de datos de descripciones.");
    }

    //4.HABILIDADES DEL POKEMON
    const abilitiesContainer = document.getElementById('abilities-list');
    miPokemon.abilities.forEach(item => {
        const spanAbility = document.createElement('span');
        spanAbility.classList.add('ability');
        const nombreLimpio = item.ability.name.replace(/-/g, ' ');
        spanAbility.textContent = nombreLimpio.charAt(0).toUpperCase() + nombreLimpio.slice(1);
        //si es una habilidad oculta lo diferenciamos
        if (item.is_hidden) {
            spanAbility.style.fontStyle = 'italic';
            spanAbility.title = "Habilidad Oculta";
        }
        abilitiesContainer.appendChild(spanAbility);
    });

    //4.STATS DEL POKEMON
    const statsMap = {
    'hp': 'pokemon-stats-hp',
    'attack': 'pokemon-stats-atk',
    'defense': 'pokemon-stats-def',
    'special-attack': 'pokemon-stats-atkesp',
    'special-defense': 'pokemon-stats-defesp',
    'speed': 'pokemon-stats-speed'
    };
    miPokemon.stats.forEach(item => {
    const statName = item.stat.name;
    const baseValue = item.base_stat;
    const elementId = statsMap[statName];

    if (elementId) {
        const spanElement = document.getElementById(elementId);
        spanElement.textContent = baseValue;

        // Actualizar la barra de progreso visual
        const progressBar = spanElement.parentElement.querySelector('.bar-fill');
        if (progressBar) {
            // Calculamos el porcentaje (asumiendo un máx de 255 que es el tope en juegos)
            const porcentaje = Math.min((baseValue / 255) * 100, 100);
            progressBar.style.width = porcentaje + '%';
            }
        }
    });

    //5.HABILIDADES DEL POKEMON
    const movesContainer = document.getElementById('moves-container');
    const movimientos = miPokemon.moves.slice(0, 12); //lo limitamos a 12 para no sobrecargar

    movimientos.forEach(item => {
        const spanMove = document.createElement('span');
        spanMove.classList.add('move');
        const nombreLimpio = item.move.name.replace(/-/g, ' ');
        spanMove.textContent = nombreLimpio.charAt(0).toUpperCase() + nombreLimpio.slice(1);
        movesContainer.appendChild(spanMove);
        });

        //7.CADENA EVOLUTIVA
        await cargarCadenaEvolutiva(miPokemonBio,miPokemon.nombre);

    }

    await imprimirPokemon(miPokemon, miPokemonBio);

    //FUNCION PARA IMPRIMIR LA CADENA EVOLUTIVA
async function cargarCadenaEvolutiva(miPokemonSpecies, nombreActual) {
    const container = document.querySelector('.evolution-chain');
    container.innerHTML = '';

    //Obtener la cadenaaa de especie
    const response = await fetch(miPokemonSpecies.evolution_chain.url);
    const data = await response.json();
    let nombresEvoluciones = [];
    let etapaActual = data.chain;

    do {
        nombresEvoluciones.push(etapaActual.species.name);
        etapaActual = etapaActual.evolves_to[0];
    } while (etapaActual);

    //Recorrer los nombres y crear el HTML
    for (let i = 0; i < nombresEvoluciones.length; i++) {
        const nombre = nombresEvoluciones[i];
        
        //Buscamos la imagen del pokemon
        const infoMin = await getPokemonMin(nombre); 
        // infoMin[0] = nombre, infoMin[1] = id, infoMin[2] = img

        //Item de evolución
        const evoItem = document.createElement('div');
        evoItem.classList.add('evo-item');

        evoItem.innerHTML = `
            <img src="${infoMin[2]}" alt="${nombre}">
            <span>${nombre.charAt(0).toUpperCase() + nombre.slice(1)}</span>
        `;

        container.appendChild(evoItem);
        if (i < nombresEvoluciones.length - 1) {
            const arrow = document.createElement('span');
            arrow.classList.add('evo-arrow');
            arrow.textContent = '›';
            container.appendChild(arrow);
        }
    }
}

//Agregamos la funcion active al boton de favoritos cuando se guarda
export function botonActive(){
    const btn = document.getElementById('btn-open-modal');
    btn.addEventListener('click', () => {btn.classList.add('active');});
}