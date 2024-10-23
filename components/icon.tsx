import React from 'react';
import {StyleSheet, TouchableWithoutFeedback, View} from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons'


export interface IconProps {
    name: keyof typeof Ionicons.glyphMap
    color?: string
    onPress?: () => void
    size?: number
}

const Icon: React.FC<IconProps> = ({onPress, name, color= "#666", size = 28}) => {
    const iconView = (
        <View style={styles.container}>
            <Ionicons name={name} size={size} color={color}/>
        </View>
    );
    return onPress ? (
        <TouchableWithoutFeedback onPress={onPress}>
            {iconView}
        </TouchableWithoutFeedback>
    ) : (iconView);
};

export default Icon;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: '3%',
    }
})