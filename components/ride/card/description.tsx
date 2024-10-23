import React from 'react';
import {StyleSheet, Text, View} from "react-native";
import {globalStyles} from "@/core/styles";

export interface DriverRowProps {
    description: string;
    category: string;
}

const DriverRow: React.FC<DriverRowProps> = ({description, category}) => {
    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <View style={[styles.cardContent, globalStyles.shadowProps]}>
                    <View style={styles.cardTextContainer}>
                        <Text style={styles.cardText}>{category}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.card}>
                <View style={[styles.cardContent, globalStyles.shadowProps]}>
                    <View style={styles.cardTextContainer}>
                        <Text style={styles.cardText}>{description}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginVertical: 6
    },
    card: {
        flex: 1,
        paddingHorizontal: 4,
        marginVertical: 4
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