import { getRandomTeam,getRandomTeamByType } from "../services/team.js";
import { getPokemonMin,getPokemonByName } from "../services/search.js";
import { redireccionamiento } from "./redireccionamiento.js";

export async function renderHistorialNodes(pokemons) {
    // 1. Mapeo previo de datos
    let mapeoDeDeseados = await Promise.all(pokemons.map(async (pokemon) => {
        // Usamos pokemon.nombre porque la estructura del objeto cambió
        const pokemonPromises = await getPokemonMin(pokemon);
        const miPokemon = await getPokemonByName(pokemon);
        return {
            pokemonBase: pokemon,
            pokemonMin: pokemonPromises,  
            pokemonFull: miPokemon        
        };
    }));

    // 2. Seleccionamos el contenedor y lo limpiamos
    const container = document.getElementById('wishlist-grid');
    const contenedorMensaje = document.getElementById("no-results-container");
    container.innerHTML = '';
    contenedorMensaje.innerHTML = '';

    // 3. Iteramos sobre los datos para armar el HTML
    mapeoDeDeseados.forEach(dato => {
        const { pokemonBase, pokemonMin, pokemonFull } = dato;

        // --- Contenedor Principal (wish-info) ---
        const wishInfo = document.createElement('div');
        wishInfo.classList.add('wish-info');
        wishInfo.id = `wish-item-${pokemonMin[1]}`;

        // --- INFO TOP ---
        const infoTop = document.createElement('div');
        infoTop.classList.add('info-top');

        const imgPok = document.createElement('div');
        imgPok.classList.add('wish-img-wrap');
        const img = document.createElement('img');
        img.classList.add('wish-img');
        img.src = pokemonMin[2];
        img.alt = pokemonBase; 
        imgPok.appendChild(img);

        const namePok = document.createElement('div');
        namePok.classList.add('wish-name');
        namePok.textContent = pokemonBase; 

        const idPok = document.createElement('div');
        idPok.classList.add('wish-id');
        idPok.textContent = `#${pokemonMin[1].toString().padStart(3, '0')}`;

        const typePok = document.createElement('div');
        typePok.classList.add('pokemon-type');
        const typeSpan = document.createElement('span');
        typeSpan.classList.add('type', pokemonFull.types['0'].type.name);
        typeSpan.textContent = pokemonFull.types['0'].type.name;
        typePok.appendChild(typeSpan);

        infoTop.append(imgPok, namePok, idPok, typePok);

        // --- INFO BOTTOM ---
        const infoBottom = document.createElement('div');
        infoBottom.classList.add('info-bottom');

        // Stats del Pokemon
        const statsDiv = document.createElement('div');
        statsDiv.classList.add('wish-stats');
        
        const statsData = [
            { label: 'HP', val: pokemonFull.stats['0'].base_stat, color: '#ff5959' },
            { label: 'ATK', val: pokemonFull.stats['1'].base_stat, color: '#ff9959' },
            { label: 'DEF', val: pokemonFull.stats['2'].base_stat, color: '#59ff9c' },
            { label: 'SPD', val: pokemonFull.stats['5'].base_stat, color: '#59e0ff' }
        ];

        statsData.forEach(stat => {
            const miniStat = document.createElement('div');
            miniStat.classList.add('mini-stat');

            const sLabel = document.createElement('span');
            sLabel.classList.add('s-label');
            sLabel.textContent = stat.label;

            const sVal = document.createElement('span');
            sVal.classList.add('s-val');
            sVal.style.color = stat.color;
            sVal.textContent = stat.val;

            miniStat.append(sLabel, sVal);
            statsDiv.appendChild(miniStat);
        });
        // --- Botones y Eventos Directos ---
        const actionsDiv = document.createElement('div');
        actionsDiv.classList.add('wish-actions');

        const btnDetail = document.createElement('button');
        btnDetail.classList.add('btn-detail');
        btnDetail.textContent = 'Ver detalle';
        btnDetail.addEventListener('click', () => {
            redireccionamiento(pokemonBase); 
        });

        actionsDiv.append(btnDetail);

        // Ensamblamos info-bottom 
        infoBottom.append(statsDiv, actionsDiv);

        // --- Ensamblaje final de la Card ---
        wishInfo.append(infoTop, infoBottom);

        // Agregamos la card al grid
        container.appendChild(wishInfo);
    });
}

//--BOTON GENERAR--
const btnGenerar = document.getElementById('btn-clear-all');
const trigger = document.getElementById('select-trigger');
const optionsList = document.getElementById('select-options');
const selectedText = document.getElementById('selected-value');

let tipoSeleccionadoActual = 'random'; 

// Abrir/Cerrar
trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    optionsList.classList.toggle('active');
});

// Selección de opción
optionsList.addEventListener('click', (e) => {
    const item = e.target.closest('li');
    if (!item) return;

    tipoSeleccionadoActual = item.getAttribute('data-value');
    selectedText.textContent = item.textContent;
    optionsList.classList.remove('active');
    
    trigger.style.borderColor = 'rgba(138, 43, 226, 0.6)';
});

// Cerrar si clicamos fuera
document.addEventListener('click', () => optionsList.classList.remove('active'));

//Boton event
btnGenerar.addEventListener('click', async () => {
    let nuevosPokemons;
        if (tipoSeleccionadoActual === 'random') {
            nuevosPokemons = await getRandomTeam();
        } else {
            nuevosPokemons = await getRandomTeamByType(tipoSeleccionadoActual);
        }
        await renderHistorialNodes(nuevosPokemons);
});