import { BASE_URL } from './config.js';

// Filtro por Tipo (Fire, Water, etc.)
export async function getListFilterType(type,offset) {
    try {
        const response = await fetch(`${BASE_URL}/type/${type}`);
        
        if (!response.ok) {
            throw new Error(`No se encontró el tipo: ${type}`);
        }
        const data = await response.json();
        const pokemonNames = data.pokemon
            .slice(offset, (12+offset))
            .map(p => p.pokemon.name);

        return pokemonNames;
    } catch (error) {
        console.error("Error al buscar por Tipo:", error);
    }
}

//Filtro por Generación (1, 2, 3...)
export async function getListFilterGeneration(gen,offset) {
    try {
        const response = await fetch(`${BASE_URL}/generation/${gen}`);
        
        if (!response.ok) {
            throw new Error(`No se encontró la generación: ${gen}`);
        }

        const data = await response.json();
        const pokemonNames = data.pokemon_species
            .slice(offset, (12+offset))
            .map(p => p.name);
        return pokemonNames;
    } catch (error) {
        console.error("Error al buscar por Generación:", error);
    }
}

//Filtro por Hábitat (Cave, Forest, etc.)
export async function getListFilterHabitat(habitat,offset) {
    try {
        const response = await fetch(`${BASE_URL}/pokemon-habitat/${habitat}`);
        
        if (!response.ok) {
            throw new Error(`No se encontró el hábitat: ${habitat}`);
        }

        const data = await response.json();
        const pokemonNames = data.pokemon_species
            .slice(offset, (12+offset))
            .map(p => p.name);
        return pokemonNames;
    } catch (error) {
        console.error("Error al buscar por Hábitat:", error);
    }
}

//Filtro por Color (Red, Blue, etc.)
export async function getListFilterColor(color, offset) {
    try {
        const response = await fetch(`${BASE_URL}/pokemon-color/${color.toLowerCase()}`);
        
        if (!response.ok) {
            throw new Error(`No se encontró el color: ${color}`);
        }

        const data = await response.json();
        const pokemonNames = data.pokemon_species
            .slice(offset, (12+offset)) 
            .map(p => p.name); 

        return pokemonNames;
    } catch (error) {
        console.error("Error al buscar por Color:", error);
        return [];
    }
}

//Filtro por Forma (Ball, Fish, etc.)
export async function getListFilterShape(shape,offset) {
    try {
        const response = await fetch(`${BASE_URL}/pokemon-shape/${shape}`);
        
        if (!response.ok) {
            throw new Error(`No se encontró la forma: ${shape}`);
        }

        const data = await response.json();
        const pokemonNames = data.pokemon_species
            .slice(offset, (12+offset))
            .map(p => p.name);
        return pokemonNames;
    } catch (error) {
        console.error("Error al buscar por Forma:", error);
    }
}

//Filtro por Región (kanto, johto, hoenn, etc.)
export async function getListFilterRegion(region,offset) {
    try {
        const response = await fetch(`${BASE_URL}/pokedex/${region}`);
        
        if (!response.ok) {
            throw new Error(`No se encontró la región/pokedex: ${region}`);
        }
        
        const data = await response.json();
        const pokemonNames = data.pokemon_entries.map(entry => entry.pokemon_species)
            .slice(offset, (12+offset))
            .map(p => p.name);
        return pokemonNames;
        
    } catch (error) {
        console.error("Error al buscar por Región:", error);
    }
}