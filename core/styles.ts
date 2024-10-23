import {StyleSheet} from "react-native";

export const globalStyles = StyleSheet.create({
    shadowProps: {
        shadowColor: '#000',
        elevation: 2,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 10,
        backgroundColor: 'transparent',
    },

    rowContainer: {
        flex: 1,
        flexDirection: 'row',
    }
});