import React, {FC} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from "react-native";
import {globalStyles} from "@/core/styles";

export interface LoadingModalProps  {
    text: string;
}

const LoadingModal: FC<LoadingModalProps> = ({text}) => {
    return (
        <View style={[styles.container, globalStyles.shadowProps]}>
            <Text style={styles.content}>{text}</Text>
            <ActivityIndicator size={"large"} color="#972620"/>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        top: '25%',
        marginHorizontal: '12.5%',
        height: '25%',
        padding: 10,
        backgroundColor: '#FFF',
        borderRadius: 8,
    },
    content: {
        fontWeight: '700',
        marginVertical: 6,
        fontSize: 16
    }
});
export default LoadingModal;