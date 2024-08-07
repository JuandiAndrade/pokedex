import { useEffect, useRef, useState } from 'react';
import {
	ActivityIndicator,
	Animated,
	ImageStyle,
	StyleProp,
	Text,
	View,
} from 'react-native';
import { useAnimation } from '../../hooks/useAnimation';

interface Props {
	uri: string;
	style?: StyleProp<ImageStyle>;
}

export const FadeInImage = ({ uri, style }: Props) => {
	const { animatedOpacity, fadeIn } = useAnimation();
	const [isLoading, setIsLoading] = useState(true);

	// cuando se termina de cargar (onLoadEnd) se hace un cambio de estado
	//  A veces cuando vayamos a hacer el scroll rapido la imagen se va a cargar pero cuando ya no este a la vista
	// es decir cuando ya paso la pantalla (viewport), entos cuando ya no este en la vista
	// el FlatList lo va a destruir por defecto,
	// entonces nos va a dar un error cuando queramos hacer un cambio de estado en un componente destruido
	// entonce stenemos que controlar cuando el FadeInImage ya no exista o no se esta biendo para evitar hacer un cambio de state
	const isDisposed = useRef(false)
	// isDisposed se va a mandar a llamar cuando el componente se destruya

	useEffect(() => {
		return () => {
			isDisposed.current = true
		}
	}, []);

	const onLoadEnd = () => {
		// si esta en true
		if (isDisposed.current) return;
		// Y si no:
		fadeIn({});
		setIsLoading(false);
	}



	return (
		<View style={{ justifyContent: 'center', alignItems: 'center' }}>
			{isLoading && (
				<ActivityIndicator
					style={{ position: 'absolute' }}
					color="grey"
					size={30}
				/>
			)}

			<Animated.Image
				source={{ uri }}
				onLoadEnd={onLoadEnd}
				style={[style, { opacity: animatedOpacity, resizeMode: 'contain' }]}
			/>
		</View>
	);
};