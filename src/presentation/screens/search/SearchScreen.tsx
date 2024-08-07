
import { FlatList, View } from 'react-native'
import { globalTheme } from '../../../config/theme/global-theme'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ActivityIndicator, Text, TextInput } from 'react-native-paper';
import { Pokemon } from '../../../domain/entities/pokemon';
import { PokemonCard } from '../../components/pokemos/PokemonCard';
import { useQuery } from '@tanstack/react-query';
import { getPokemonNamesWithId, getPokemonsByIds } from '../../../actions/pokemos';
import { useMemo, useState } from 'react';
import { FullScreenLoader } from '../../components/ui/FullScreenLoader';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';

export const SearchScreen = () => {

	const { top } = useSafeAreaInsets();
	const [term, setTerm] = useState('');

	const debounceValue = useDebouncedValue(term)

	// si no viene la data entonces es un arreglo vacio
	const { isLoading, data: pokemonNameList = [] } = useQuery({
		queryKey: ['pokemon', 'all'],
		queryFn: () => getPokemonNamesWithId()
	});

	// uso un useMemo porque quiero memorizar el procesamiento que voy a hacer de este listado
	// todo: aplicar luego el debounce
	const pokemonNameIdList = useMemo(() => {
		// es un numero
		if (!isNaN(Number(debounceValue))) {
			const pokemon = pokemonNameList.find(pokemon => pokemon.id === Number(term));
			return pokemon ? [pokemon] : [];
		}

		if (debounceValue.length === 0) return [];

		if (debounceValue.length < 3) return [];

		return pokemonNameList.filter(pokemon =>
			pokemon.name.includes(debounceValue.toLocaleLowerCase())
		);


	}, [debounceValue])


	// renombro isLoading para que no se choque con el otro que tenemos
	const { isLoading: isLoadingPokemons, data: pokemons = [] } = useQuery({
		queryKey: ['pokemons', 'by', pokemonNameIdList],
		queryFn: () => getPokemonsByIds(pokemonNameIdList.map(pokemon => pokemon.id)),
		staleTime: 1000 * 60 * 5, //5min
	})


	if (isLoading) {
		return (<FullScreenLoader />)
	}

	return (
		<View style={[globalTheme.globalMargin, { paddingTop: top + 10 }]}>
			<TextInput
				placeholder='Buscar Pokémon'
				mode='flat'
				autoFocus
				autoCorrect={false}
				onChangeText={setTerm}
				value={term}
			/>

			{isLoadingPokemons && (
				<ActivityIndicator style={{ paddingTop: 20 }} />
			)}


			<FlatList
				data={pokemons}
				keyExtractor={(pokemon, index) => `${pokemon.id}-${index}`}
				numColumns={2}
				style={{ paddingTop: top + 20 }}
				renderItem={({ item }) =>
					<PokemonCard pokemon={item} />}
				onEndReachedThreshold={0.6}
				showsVerticalScrollIndicator={false}

				// Para que se pueda hacer scroll para abajo, porque sino por defecto el estilo del FlatList toma todo el espacio posible
				ListFooterComponent={<View style={{height: 150}} />}
			/>

		</View>
	)
}
