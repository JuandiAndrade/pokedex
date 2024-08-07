import { pokeApi } from "../../config/api/pokeApi";
import { Pokemon } from "../../domain/entities/pokemon";
import { PokeAPIPokemon } from "../../infrastructure/interfaces/pokeApi.interface";
import { PokemonMapper } from "../../infrastructure/mappers/pokemon.mapped";
import { getPokemonById } from "./get-pokemon-by-id";



export const getPokemonsByIds = async (ids: number[]): Promise<Pokemon[]> => {
	try {

		const pokemosPromises: Promise<Pokemon>[] = ids.map(id => {
			return getPokemonById(id);
		})
		return Promise.all(pokemosPromises)

	} catch (error) {
		throw new Error(`Error getting pokemons by ids: ${ids}`)
	}
}