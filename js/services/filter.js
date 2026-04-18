import { BASE_URL } from './config.js';

// Filtro por Tipo (Fire, Water, etc.)
export async function getListFilterType(type) {
    try {
        const response = await fetch(`${BASE_URL}/type/${type}`);
        
        if (!response.ok) {
            throw new Error(`No se encontró el tipo: ${type}`);
        }

        const data = await response.json();
        // Mapeamos para obtener una lista uniforme de nombres/urls
        return data.pokemon.map(p => p.pokemon); 
    } catch (error) {
        console.error("Error al buscar por Tipo:", error);
    }
}

//Filtro por Generación (1, 2, 3...)
export async function getListFilterGeneration(gen) {
    try {
        const response = await fetch(`${BASE_URL}/generation/${gen}`);
        
        if (!response.ok) {
            throw new Error(`No se encontró la generación: ${gen}`);
        }

        const data = await response.json();
        return data.pokemon_species; 
    } catch (error) {
        console.error("Error al buscar por Generación:", error);
    }
}

//Filtro por Hábitat (Cave, Forest, etc.)
export async function getListFilterHabitat(habitat) {
    try {
        const response = await fetch(`${BASE_URL}/pokemon-habitat/${habitat}`);
        
        if (!response.ok) {
            throw new Error(`No se encontró el hábitat: ${habitat}`);
        }

        const data = await response.json();
        return data.pokemon_species;
    } catch (error) {
        console.error("Error al buscar por Hábitat:", error);
    }
}

//Filtro por Color (Red, Blue, etc.)
export async function getListFilterColor(color) {
    try {
        const response = await fetch(`${BASE_URL}/pokemon-color/${color}`);
        
        if (!response.ok) {
            throw new Error(`No se encontró el color: ${color}`);
        }

        const data = await response.json();
        return data.pokemon_species;
    } catch (error) {
        console.error("Error al buscar por Color:", error);
    }
}

//Filtro por Forma (Ball, Fish, etc.)
export async function getListFilterShape(shape) {
    try {
        const response = await fetch(`${BASE_URL}/pokemon-shape/${shape}`);
        
        if (!response.ok) {
            throw new Error(`No se encontró la forma: ${shape}`);
        }

        const data = await response.json();
        return data.pokemon_species;
    } catch (error) {
        console.error("Error al buscar por Forma:", error);
    }
}

//Filtro por Región (kanto, johto, hoenn, etc.)
export async function getListFilterRegion(region) {
    try {
        const response = await fetch(`${BASE_URL}/pokedex/${region}`);
        
        if (!response.ok) {
            throw new Error(`No se encontró la región/pokedex: ${region}`);
        }
        
        const data = await response.json();
        return data.pokemon_entries.map(entry => entry.pokemon_species);
    } catch (error) {
        console.error("Error al buscar por Región:", error);
    }
}