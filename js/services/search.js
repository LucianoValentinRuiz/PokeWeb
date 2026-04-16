const BASE_URL = `https://pokeapi.co/api/v2/`;

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
        const result = [
            data.name,
            data.id,
            data.sprites.other['official-artwork'].front_default
        ];

        return result;
    }
    catch(error) {
        console.log(error);
    }
}

export async function getPokemonById(id) {
    try {
        const response = await fetch(`${BASE_URL}/pokemon/${id}`);
        
        if (!response.ok) {
            throw new Error(`No se encontró el Pokémon con ID: ${id}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al buscar por ID:", error);
    }
}
