
import { StyleSheet, View } from 'react-native'
import { ActivityIndicator, Button, FAB, Text, useTheme } from 'react-native-paper'
import { getPokemons } from '../../../actions/pokemos'
import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query'
import { PokeballBg } from '../../components/ui/PokeballBg'
import { FlatList } from 'react-native-gesture-handler'
import { globalTheme } from '../../../config/theme/global-theme'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { PokemonCard } from '../../components/pokemos/PokemonCard'
import { StackScreenProps } from '@react-navigation/stack'
import { RootStackParams } from '../../navigator/StackNavigator'


interface Props extends StackScreenProps<RootStackParams, 'HomeScreen'>{};

export const HomeScreen = ({navigation}: Props) => {
	const { top } = useSafeAreaInsets();

	const queryClient = useQueryClient();

	const theme = useTheme();

	// todo: cuando no usamos tanstackQuery => deberiamos hacer verificaciones (try/catch) cuando hacemos peticiones http

	// Todo: esta es la forma tradicional de http
	// a la data lo estoy nombrando pokemons
	// const { isLoading, data: pokemons = [] } = useQuery({
	// 	// queryKey es un indentificador para que lo peuda manejar en cache
	// 	queryKey: ['pokemons'],
	// 	// le pongo 0 porque quiero la primera pagina
	// 	queryFn: () => getPokemons(0),
	// 	// staleTime tiempo que quiero que me mantenga la data
	// 	staleTime: 1000 * 60 * 60, //60 min
	// });

	// // Todo: forma con un infinite scroll
	// const { isLoading, data, fetchNextPage } = useInfiniteQuery({
	// 	queryKey: ['pokemons', 'infinite'],
	// 	initialPageParam: 0,
	// 	queryFn: (params) => getPokemons(params.pageParam),
	// 	getNextPageParam: ( lastPage, pages ) => pages.length, 
	// 	staleTime: 1000 * 60 * 60, //60 min
	// });

	// Todo: ahora quiero poder tener acceso al queryClient de PokedexApp que es donde se termina almacenando todo el cache
	// todo: e insertar la informacion de cada uno de los pokemon que yo tengo de ante mano
	// todo: para cuando yo en mi pokemon Screen haga la peticion al cache (queryKey de este componente)
	// todo. yo ya tenga esta respuesta
	const { isLoading, data, fetchNextPage } = useInfiniteQuery({
		queryKey: ['pokemons', 'infinite'],
		initialPageParam: 0,
		staleTime: 1000 * 60 * 60, //60 min

		queryFn: async (params) => {
			const pokemons = await getPokemons(params.pageParam);
			pokemons.forEach(pokemon => {
				// tengo que poner exactamente el queryKey: ['pokemon', pokemoinId], que esta en mi PokemonScreen
				queryClient.setQueryData(['pokemon', pokemon.id], pokemon)
			});
			return pokemons
		},
		// tiene que estar al final porque me tomaba ${pokemon.id} como indefinido
		getNextPageParam: (lastPage, pages) => pages.length,

	});

	return (
		<View style={globalTheme.globalMargin}>
			<PokeballBg style={style.imgPosition} />

			<FlatList
				data={data?.pages.flat() ?? []}
				keyExtractor={(pokemon, index) => `${pokemon.id}-${index}`}
				numColumns={2}
				style={{ paddingTop: top + 20 }}
				ListHeaderComponent={() => (
					<Text variant='displayMedium'>Pokédex</Text>
				)}
				renderItem={({ item }) =>
					<PokemonCard pokemon={item} />}
				onEndReachedThreshold={0.6}
				onEndReached={() => fetchNextPage()}
				showsVerticalScrollIndicator={false}
			/>
			<FAB 
			label='Buscar'
			style={[globalTheme.fab, {backgroundColor: theme.colors.primary}]}
			mode='elevated'
			color={theme.dark? 'black' : 'white'}
			onPress={()=> navigation.push('SearchScreen')}
			/>
		</View>
	);
};



const style = StyleSheet.create({
	imgPosition: {
		position: 'absolute',
		top: -100,
		right: -100,
	}
})
