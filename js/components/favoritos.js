import { getPokemonMin,getPokemonByName } from "../services/search.js";
import { redireccionamiento } from "./redireccionamiento.js";
import { imprimirPokemonModal, botonCerrarModal, prepararEliminacion } from "./modalEliminar.js";
import { prepararLimpieza} from "./modalLimpiar.js";
import { getFromLocalStorage } from "./localStorage.js";

const listaFavoritos = getFromLocalStorage("favoritos");
let contador = 0;

// 1. Agregamos 'async' antes de los parámetros
async function renderWishlistNodes(pokemons) {
    
    // 1. Mapeo previo de datos (Equivalente a mapPokemon en loadPokemon)
    // Usamos Promise.all para resolver todas las llamadas a la API en paralelo
    let mapeoDeDeseados = await Promise.all(pokemons.map(async (pokemon) => {
        const pokemonPromises = await getPokemonMin(pokemon.name);
        const miPokemon = await getPokemonByName(pokemon.name);
        return {
            pokemonBase: pokemon,         // Los datos originales que vienen en el array
            pokemonMin: pokemonPromises,  // Los datos del fetch mínimo
            pokemonFull: miPokemon        // Los datos detallados
        };
    }));

    // 2. Seleccionamos el contenedor principal y lo limpiamos
    const container = document.getElementById('wishlist-grid');
    container.innerHTML = '';

    // 3. Iteramos sobre los datos ya procesados para construir las cards
    mapeoDeDeseados.forEach(dato => {
        // Contador
        contador = contador + 1;
        // Desestructuramos para mantener el código limpio
        const { pokemonBase, pokemonMin, pokemonFull } = dato;

        // --- Contenedor Principal (wish-info) ---
        const wishInfo = document.createElement('div');
        wishInfo.classList.add('wish-info');
        wishInfo.id = `wish-item-${pokemonMin[1]}`;

        // --- INFO TOP ---
        const infoTop = document.createElement('div');
        infoTop.classList.add('info-top');

        // Contenedor de Imagen
        const imgPok = document.createElement('div');
        imgPok.classList.add('wish-img-wrap');
        const img = document.createElement('img');
        img.classList.add('wish-img');
        img.src = pokemonMin[2];
        img.alt = pokemonBase.name;
        imgPok.appendChild(img);

        // Nombre del Pokemon
        const namePok = document.createElement('div');
        namePok.classList.add('wish-name');
        namePok.textContent = pokemonBase.name;

        // ID del Pokemon
        const idPok = document.createElement('div');
        idPok.classList.add('wish-id');
        idPok.textContent = `#${pokemonMin[1].toString().padStart(3, '0')}`;

        // Tipo del Pokemon
        const typePok = document.createElement('div');
        typePok.classList.add('pokemon-type');
        const typeSpan = document.createElement('span');
        typeSpan.classList.add('type', pokemonFull.types['0'].type.name);
        typeSpan.textContent = pokemonFull.types['0'].type.name;
        typePok.appendChild(typeSpan);

        // Ensamblamos info-top
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

        // Extras (Etiquetas, prioridad, notas)
        const extraDiv = document.createElement('div');
        extraDiv.classList.add('wish-extra');
        extraDiv.style.marginTop = '10px';

        const createExtraRow = (keyText, valText) => {
            const row = document.createElement('div');
            row.classList.add('extra-row');
            
            const key = document.createElement('span');
            key.classList.add('extra-key');
            key.textContent = keyText;
            
            const val = document.createElement('span');
            val.classList.add('extra-val');
            val.textContent = valText;
            
            row.append(key, val);
            return row;
        };

        const rowEtiqueta = createExtraRow('Etiqueta', pokemonBase.category);
        const rowPrioridad = createExtraRow('Prioridad', `#${pokemonBase.priority}/5`);
        
        const noteDiv = document.createElement('div');
        noteDiv.classList.add('wish-note');
        noteDiv.textContent = pokemonBase.comment;

        extraDiv.append(rowEtiqueta, rowPrioridad, noteDiv);

        // Botones y Eventos Directos
        const actionsDiv = document.createElement('div');
        actionsDiv.classList.add('wish-actions');

        const btnDetail = document.createElement('button');
        btnDetail.classList.add('btn-detail');
        btnDetail.textContent = 'Ver detalle';
        btnDetail.addEventListener('click', () => {
            redireccionamiento(pokemonBase.name);
        });

        const btnRemove = document.createElement('button');
        btnRemove.classList.add('btn-remove');
        btnRemove.textContent = '✕';
        btnRemove.addEventListener('click', async () => {
            //Se carga el HTML del modal
            const container = document.getElementById('modal-container');
            const response = await fetch('modalEliminar.html');
            const htmlText = await response.text();
            container.innerHTML = htmlText;
            await imprimirPokemonModal(pokemonBase.name,pokemonMin[1],pokemonMin[2]);
            await botonCerrarModal();
            await prepararEliminacion(pokemonBase.name,'favoritos');
        });

        actionsDiv.append(btnDetail, btnRemove);

        // Ensamblamos info-bottom
        infoBottom.append(statsDiv, extraDiv, actionsDiv);

        // --- Ensamblaje final de la Card ---
        wishInfo.append(infoTop, infoBottom);

        // Agregamos la card al grid
        container.appendChild(wishInfo);
    });
}
console.log(listaFavoritos.length)
if (listaFavoritos.length === 0){
    console.log("esta vacio");    
    }
else{
    await renderWishlistNodes(listaFavoritos);
    document.getElementById('count').textContent = contador;
}


const btnLimpiar = document.getElementById('btn-clear-all').addEventListener('click', async () => {
    //Se carga el HTML del modal
    const container = document.getElementById('modal-container');
    const response = await fetch('modalLimpiar.html');
    const htmlText = await response.text();
    container.innerHTML = htmlText;
    await botonCerrarModal();
    await prepararLimpieza('favoritos');
        });