import { pokeApi } from "../../config/api/pokeApi"
import { PokeAPIPaginatedResponse } from "../../infrastructure/interfaces/pokeApi.interface"



export const getPokemonNamesWithId = async () => {

	const url = `pokemon?limit=1000`
	const {data} = await pokeApi.get<PokeAPIPaginatedResponse>(url);

	return data.results.map((info) => ({
		id:Number(info.url.split('/')[6]),
		name: info.name,
	}))

}


/*
{
id: 1,
name: 'bulbasur'
}
*/