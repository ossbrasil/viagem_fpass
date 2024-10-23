import React from 'react';
import {StyleSheet, Text, View} from "react-native";
import {globalStyles} from "@/core/styles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {Driver} from "@/core/interfaces/ride";

export interface DriverRowProps {
    driver: Driver
}

const DriverRow: React.FC<DriverRowProps> = ({driver}) => {
    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <View style={[styles.cardContent, globalStyles.shadowProps]}>
                    <MaterialIcons name={'perm-identity'} size={28}/>
                    <View style={styles.cardTextContainer}>
                        <Text style={styles.cardText}>{driver.name}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    card: {
        flex: 1,
        paddingHorizontal: 4,
    },
    cardContent: {
        backgroundColor: '#FFF',
        borderRadius: 6,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 5,
        paddingVertical: 6
    },
    cardTextContainer: {
        paddingLeft: 10,
        justifyContent: 'space-around'
    },
    cardText: {
        fontSize: 16,
        fontWeight: 'bold',
    }
});
export default DriverRow;