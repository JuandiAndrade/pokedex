
import { Text, View } from 'react-native'
import { ActivityIndicator, useTheme } from 'react-native-paper'

export const FullScreenLoader = () => {

    // tenemos que cambiar el color basado en el tema 
    // tenemos varias alternativas: context, usetheme, navigationnative. Lo podemos tomar de varios lados

    const {colors} = useTheme()

    return (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.background,
        }}>
        <ActivityIndicator size={50} />
        </View>
    )
}
