import React from 'react';
import {StyleSheet, Text, View} from "react-native";
import {globalStyles} from "@/core/styles";
import {formatDateString} from "@/common/parsers/parse-date-string";

export interface RideTimeProps {
    startTime: number;
    endTime: number;
    completed?: boolean;
}

const RideTime: React.FC<RideTimeProps> = ({startTime, endTime, completed = false}) => {
    return (
        <View>
            <View style={styles.card}>
                {!completed ?
                    <Text style={{fontSize: 18, color: '#FAFAFA', fontWeight: 600}}>Horario Esperado de partida</Text>
                    :
                    <Text style={{fontSize: 18, color: '#FAFAFA', fontWeight: 600}}>Duração da viagem</Text>
                }
                <View style={[styles.cardContent, globalStyles.shadowProps]}>
                    <View style={styles.cardTextContainer}>
                        <Text
                            style={styles.cardText}>{formatDateString(startTime)} até {formatDateString(endTime, true)}</Text>
                    </View>
                </View>
            </View>
        </View>

    );
};
export default RideTime;
const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        marginVertical: 6
    },
    card: {
        flex: 1,
        paddingHorizontal: 4,
        alignItems: "center"
    },
    cardContent: {
        height: 45,
        backgroundColor: '#FFF',
        borderRadius: 6,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 5,
    },
    cardTextContainer: {
        flex: 1,
        paddingLeft: 10,
        alignItems: 'center'
    },
    cardText: {
        fontSize: 18,
        fontWeight: 'bold',
    }
});