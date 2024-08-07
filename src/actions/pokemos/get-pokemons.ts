import { pokeApi } from "../../config/api/pokeApi";
import { Pokemon } from "../../domain/entities/pokemon";
import type { PokeAPIPaginatedResponse, PokeAPIPokemon } from "../../infrastructure/interfaces/pokeApi.interface";
import { PokemonMapper } from "../../infrastructure/mappers/pokemon.mapped";

// export const sleep = async() => {
// 	return new Promise(reslve => setTimeout(reslve, 2000))
// }

export const getPokemons = async (
	page: number, 
	limit: number = 20
): Promise<Pokemon[]> => {
	// await sleep(); 

	try {

		const url = `/pokemon?offset=${page * 10}&limit=${limit}`;
		const { data } = await pokeApi.get<PokeAPIPaginatedResponse>(url);


		// no usamos async porque sino haria las 20 peticiones en secuencia y nosotros necesitamos las 20 peticiones en paralelo
		// es un arreglo de promesas
		const pokemonPromises = data.results.map((info) => {
			return pokeApi.get<PokeAPIPokemon>(info.url);
		})

		// // ahora si necesitamos esperar a que todas esas promesas se terminen:
		// const pokeApiPokemons = await Promise.all(pokemonPromises);
		// const pokemons = pokeApiPokemons.map((item) => PokemonMapper.pokeApiPokemonToEntity(item.data));

		// console.log(pokemons[0])

		// return pokemons;

		//todo se cambio la logica anterior porque ahora nuestro mapped realizo una promesa entonces, antes regresabamos solo los pokemons, pero ahora es una promesa que resuelve los pokemons
		const pokeApiPokemons = await Promise.all(pokemonPromises);
		const pokemonsPromise = pokeApiPokemons.map((item) => PokemonMapper.pokeApiPokemonToEntity(item.data));

		return await Promise.all(pokemonsPromise);

	} catch (error) {
		console.log(error)
		throw new Error('Error getting pokemons')
	}

}