import { createContext, PropsWithChildren } from "react";

import {
	NavigationContainer,
	DarkTheme as NavigationDarkTheme,
	DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import { adaptNavigationTheme, PaperProvider } from 'react-native-paper';
import { useColorScheme } from "react-native";

const { LightTheme, DarkTheme } = adaptNavigationTheme({
	reactNavigationLight: NavigationDefaultTheme,
	reactNavigationDark: NavigationDarkTheme,
});

export const ThemeContext = createContext({
	isDark: false,
	theme: LightTheme
})


export const ThemeContextProvider = ({ children }: PropsWithChildren) => {

	const colorScheme = useColorScheme();
	const isDark = colorScheme === 'dark';
	const theme = isDark ? DarkTheme : LightTheme;



	return (
		<PaperProvider theme={theme}>
			<NavigationContainer theme={theme}>
				<ThemeContext.Provider value={{
					// Hago esto para saber siempre en que tema estoy
					// Es decir que en nuestro contexto ya tenemos una manera de saber si nuestro tema esta en modo oscuro o no
					isDark,
					theme
				}}>
					{children}
				</ThemeContext.Provider>
			</NavigationContainer>
		</PaperProvider>
	)
}