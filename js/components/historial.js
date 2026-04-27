import { getPokemonMin,getPokemonByName } from "../services/search.js";
import { redireccionamiento } from "./redireccionamiento.js";
import { getFromLocalStorage } from "./favoritos.js";
import { imprimirPokemonModal, botonCerrarModal, prepararEliminacion } from "./modalEliminar.js";
import { prepararLimpieza} from "./modalLimpiar.js";

const listaHistorial = getFromLocalStorage('historial');
let contador = 0;
export async function renderHistorialNodes(pokemons) {
    // 1. Mapeo previo de datos
    let mapeoDeDeseados = await Promise.all(pokemons.map(async (pokemon) => {
        // Usamos pokemon.nombre porque la estructura del objeto cambió
        const pokemonPromises = await getPokemonMin(pokemon.name);
        const miPokemon = await getPokemonByName(pokemon.name);
        return {
            pokemonBase: pokemon,
            pokemonMin: pokemonPromises,  
            pokemonFull: miPokemon        
        };
    }));

    // 2. Seleccionamos el contenedor y lo limpiamos
    const container = document.getElementById('wishlist-grid');
    container.innerHTML = '';

    // 3. Iteramos sobre los datos para armar el HTML
    mapeoDeDeseados.forEach(dato => {
        contador = contador + 1;
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
        img.alt = pokemonBase.name; 
        imgPok.appendChild(img);

        const namePok = document.createElement('div');
        namePok.classList.add('wish-name');
        namePok.textContent = pokemonBase.name; 

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

        // --- EXTRAS: Visitado y Tiempo ---
        const extraDiv = document.createElement('div');
        extraDiv.classList.add('wish-extra');
        extraDiv.style.marginTop = '10px';

        const extraRow = document.createElement('div');
        extraRow.classList.add('extra-row');

        const sKey = document.createElement('div');
        sKey.classList.add('s-key');
        sKey.textContent = 'Visitado';

        const infoVal = document.createElement('div');
        infoVal.classList.add('info-val');

        // LÓGICA DE FECHA SIMPLIFICADA
        // Ya no necesitamos buscar en el localStorage porque la data viene en pokemonBase
        if (pokemonBase.fechaVisita) {
            const fecha = new Date(pokemonBase.fechaVisita);
            const opcionesDeFormato = { 
                day: 'numeric', 
                month: 'short', 
                hour: '2-digit', 
                minute: '2-digit' 
            };
            infoVal.textContent = fecha.toLocaleDateString('es-ES', opcionesDeFormato);
        } else {
            infoVal.textContent = 'Sin registro'; 
        }

        extraRow.append(sKey, infoVal);
        extraDiv.appendChild(extraRow);

        // --- Botones y Eventos Directos ---
        const actionsDiv = document.createElement('div');
        actionsDiv.classList.add('wish-actions');

        const btnDetail = document.createElement('button');
        btnDetail.classList.add('btn-detail');
        btnDetail.textContent = 'Ver detalle';
        btnDetail.addEventListener('click', () => {
            redireccionamiento(pokemonBase.name); // Cambiado a .nombre
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
            await prepararEliminacion(pokemonBase.name,'historial');
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

if (listaHistorial.length === 0){
    console.log("esta vacio");    
}
else{
    await renderHistorialNodes(listaHistorial);
    document.getElementById("count").textContent = contador;
}

const btnLimpiar = document.getElementById('btn-clear-all').addEventListener('click', async () => {
    //Se carga el HTML del modal
    const container = document.getElementById('modal-container');
    const response = await fetch('modalLimpiar.html');
    const htmlText = await response.text();
    container.innerHTML = htmlText;
    await botonCerrarModal();
    await prepararLimpieza('historial');
        });