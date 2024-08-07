import ImageColors from "react-native-image-colors"



export const getColorFromImage = async (image: string) => {

	const fallBackColor = 'gray'

	const colors = await ImageColors.getColors(image, {
		fallback: fallBackColor,
	});

	switch (colors.platform) {
		case 'android':
			return colors.dominant ?? fallBackColor;

		case 'ios':
			return colors.background ?? fallBackColor;

		default:
			return fallBackColor;
	}


}