import { BASE_URL } from './config.js';

export async function getListPokemon(offset) {
    let config = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        mode: 'cors',
        cache: 'default'
    };
    let url =  `${BASE_URL}/pokemon`;
    let params = [];

    params.push(`limit=${encodeURIComponent(12)}`);

    if (offset !== null) { 
        params.push(`offset=${encodeURIComponent(offset)}`);
    }

    if (params.length > 0) {
        url += '?' + params.join('&');
    }
    console.log(url);
    try {
        const response = await fetch(url, config);

        if (response.ok) {
            let result = await response.json();
            const pokemonNames = result.results.map(pokemon => pokemon.name);
            return pokemonNames;
        } else {
            alert("Error en la respuesta del servidor");
            let errorDetails = await response.json();
            alert(JSON.stringify(errorDetails));
        }
    } catch (error) {
        console.log("Error:", error);
    }
};
