import { BASE_URL } from './config.js';

//Trae datos relacionaados con el videojuego
export async function getPokemonMin(name) {
    let config = {
        method: 'GET',
        headers:
        {
            'Content-Type': 'application/json'
        }
    }
    try {
        const response = await fetch(`${BASE_URL}/pokemon-form/${name}/`, config);
        let data = await response.json();
        const result = [
            data.name,
            data.id,
            data.sprites.front_default,
            //data.sprites.other['official-artwork'].front_default,
            data.types['0'].type.name
        ];

        return result;
    }
    catch(error) {
        console.log(error);
    }
}

export async function getPokemonByName(name) {
    let config = {
        method: 'GET',
        headers:
        {
            'Content-Type': 'application/json'
        }
    }
    try {
        const response = await fetch(`${BASE_URL}/pokemon/${name}`, config);
        let data = await response.json();
        /*const result = [
            data.name,
            data.id,
            data.sprites.other['official-artwork'].front_default,
            data.types['0'].type.name
        ];*/

        return data;
    }
    catch(error) {
        console.log(error);
    }
}

//trae datos relacionados con la especie
export async function getPokemonById(id) {
    try {
        const response = await fetch(`${BASE_URL}/pokemon-form/${id}/`);
        
        if (!response.ok) {
            throw new Error(`No se encontró el Pokémon con ID: ${id}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al buscar por ID:", error);
    }
}
