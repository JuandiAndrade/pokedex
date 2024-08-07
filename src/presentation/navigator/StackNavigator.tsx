import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from '../screens/home/HomeScreen';
import { PokemonScreen } from '../screens/pokemon/PokemonScreen';
import { SearchScreen } from '../screens/search/SearchScreen';


export type RootStackParams = {
	// undefined que no recibe ningun argumento
	HomeScreen: undefined;
	PokemonScreen: { pokemoinId: number };
	SearchScreen: undefined;
}

const Stack = createStackNavigator<RootStackParams>();

export const StackNavigator = () => {
	return (
		<Stack.Navigator screenOptions={{
			headerShown: false
		}}>
			<Stack.Screen name="HomeScreen" component={HomeScreen} />
			<Stack.Screen name="PokemonScreen" component={PokemonScreen} />
			<Stack.Screen name="SearchScreen" component={SearchScreen} />

		</Stack.Navigator>
	);
}