import { getListFilterType,getListFilterGeneration,getListFilterHabitat,getListFilterColor,getListFilterShape,getListFilterRegion } from '../services/filter.js';
import { loadPokemon, setOffset } from './prueba.js';

let tipoDato,valor;

const datosPokedex = {
        "Tipos": [
            "Steel", "Water", "Bug", "Dragon", "Electric", "Fairy", 
            "Fighting", "Fire", "Flying", "Ghost", "Grass", "Ground", 
            "Ice", "Normal", "Poison", "Psychic", "Rock", "Dark"
        ],
        "Generacion": [
            "1", "2", "3", "4", 
            "5", "6", "7", "8", "9"
        ],
        "Habitat": [
            "Cave", "Forest", "Grassland", "Mountain", "Rare", 
            "Sea", "Urban", "Waters-Edge", "Rough-Terrain"
        ],
        "Color": [
            "Black", "Blue", "Brown", "Gray", "Green", 
            "Pink", "Purple", "Red", "White", "Yellow"
        ],
        "Region": [
            "Kanto", "Johto", "Hoenn", "Sinnoh", "Unova",
        ]
    };

const enlaces = document.querySelectorAll('.submenu li a');
const contenedor = document.getElementById('destino-select');

enlaces.forEach(link => {
    link.addEventListener('click', function(event) {
        const categoria = this.textContent.trim();
        
        if (datosPokedex[categoria]) {
            event.preventDefault(); 
            generarMenu(categoria);
        } 
    });
});

async function generarMenu(nombre) {
    contenedor.innerHTML = "";

    if (datosPokedex[nombre]) {
        const label = document.createElement('label');
        label.textContent = `Selecciona ${nombre}: `;

        const select = document.createElement('select');
        
        select.id = `filtro-${nombre.toLowerCase()}`;

        const placeholder = document.createElement('option');
        placeholder.textContent = "-- Elige una opción --";
        placeholder.value = "";
        select.appendChild(placeholder);

        datosPokedex[nombre].forEach(item => {
            const opt = document.createElement('option');
            // Aquí guardamos el valor que usaremos para la API
            opt.value = item.toLowerCase(); 
            opt.textContent = item;
            select.appendChild(opt);
        });

        // --- AQUÍ RECUPERAMOS EL DATO ---
        select.addEventListener('change', async (e) => {
            const valorSeleccionado = e.target.value;
            
            if (valorSeleccionado !== "") {

                try {
                    console.log(valorSeleccionado);
                    await ejecutarFiltro(nombre, valorSeleccionado);
                    console.log("Filtro aplicado con éxito");
                } catch (error) {
                    console.error("Error al ejecutar el filtro:", error);
                }
        }
    });

        contenedor.appendChild(label);
        contenedor.appendChild(select);
    }
}

async function ejecutarFiltro(categoria, valor) {
    switch (categoria) {
        case "Tipos":
            setOffset(0);
            await loadPokemon(valor,getListFilterType);
            break;
        case "Generacion":
            setOffset(0);
            await loadPokemon(valor,getListFilterGeneration);
            break;
        case "Habitat":
            setOffset(0);
            await loadPokemon(valor,getListFilterHabitat);
            break;
        case "Color":
            setOffset(0);
            await loadPokemon(valor,getListFilterColor);
            break;
        case "Region":
            setOffset(0);
            let valorId = 1;
            if (valor === "kanto") {
                valorId = 2;
            } else if (valor === "johto") {
                valorId = 7;
            } else if (valor === "hoenn") {
                valorId = 4;
            } else if (valor === "sinnoh") {
                valorId = 6;
            } else if (valor === "unova") {
                valorId = 9;
            }
            console.log(valor);
            console.log(valorId);
            await loadPokemon(valorId,getListFilterRegion);
            break;
        default:
            console.log("algo te salio mal che");
    }
}