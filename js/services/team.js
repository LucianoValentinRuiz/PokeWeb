import { BASE_URL } from './config.js';

/**
 * Genera un equipo aleatorio de 6 Pokémon.
 * @returns {Promise<string[]>} Array con los nombres de los 6 Pokémon.
 */
export async function getRandomTeam() {
    try {
        const teamNames = [];
        const maxPokemon = 1025; // Cantidad actual de Pokémon en la API
        const teamSize = 6;
        const ids = new Set();

        // Generamos 6 IDs únicos al azar
        while (ids.size < teamSize) {
            const randomId = Math.floor(Math.random() * maxPokemon) + 1;
            ids.add(randomId);
        }

        const promises = Array.from(ids).map(id => 
            fetch(`${BASE_URL}/pokemon/${id}`).then(res => {
                if (!res.ok) throw new Error(`Error al obtener Pokémon con ID: ${id}`);
                return res.json();
            })
        );

        const results = await Promise.all(promises);
        
        return results.map(pokemon => pokemon.name);

    } catch (error) {
        console.error("Error al generar el equipo aleatorio:", error);
        return [];
    }
}

export async function getRandomTeamByType(type) {
    try {
        //Obtenemos la lista completa de ese tipo
        const response = await fetch(`${BASE_URL}/type/${type}`);
        if (!response.ok) throw new Error(`Error al obtener tipo: ${type}`);
        
        const data = await response.json();
        const allPokemonOfType = data.pokemon; 
        const teamNames = [];
        const idsSet = new Set();

        //elegimos 6 índices aleatorios de esa lista
        const cantidadDisponible = allPokemonOfType.length;
        const totalAObtener = Math.min(6, cantidadDisponible);

        while (idsSet.size < totalAObtener) {
            const randomIndex = Math.floor(Math.random() * cantidadDisponible);
            idsSet.add(randomIndex);
        }

        idsSet.forEach(index => {
            teamNames.push(allPokemonOfType[index].pokemon.name);
        });

        return teamNames;
    } catch (error) {
        console.error("Error en equipo por tipo:", error);
        return [];
    }
}