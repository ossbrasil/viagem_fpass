import React, {ReactElement} from 'react';
import {Pressable, StyleSheet, Text} from "react-native";
import {IconProps} from "@/components/icon";
import {globalStyles} from "@/core/styles";

export enum ButtonType {
    'SUCCESS' = '#198754',
    'DANGER' = '#761F1D',
    'WARNING' = '#FFC107',
    'INFO' = '#01AFD9',
    'MAIN' = '#000',
}

export interface ButtonProps {
    title: string;
    type: ButtonType;
    size: 'sm' | 'md' | 'lg';
    onPress: (() => void | Promise<void>);
    prefixIcon?: ReactElement<IconProps>;
    suffixIcon?: ReactElement<IconProps>;
    disabled?: boolean;
}

const CustomButton: React.FC<ButtonProps> = (
    {
        title,
        onPress,
        prefixIcon,
        suffixIcon,
        type,
        size,
        disabled = false,
    }) => {
    return (
        <Pressable onPress={onPress}
                   disabled={disabled}
                   style={[styles({type, size, disabled}).container, globalStyles.shadowProps]}
        >
            {prefixIcon}
            <Text style={styles({type, size, disabled}).title}>{title}</Text>
            {suffixIcon}
        </Pressable>
    );
};

export default CustomButton;

const styles = (props: { type: ButtonType, size: 'sm' | 'md' | 'lg', disabled: boolean }) => StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'center',
        maxHeight: {'sm': 20, 'md': 40, 'lg': 60}[props.size],
        borderRadius: {'sm': 4, 'md': 6, 'lg': 10}[props.size],
        backgroundColor: props.disabled ? '#999' : props.type,
        marginHorizontal: 4
    },
    title: {
        color: '#FFF',
        fontSize: {'sm': 14, 'md': 18, 'lg': 24}[props.size],
        fontWeight: 'bold',
        textShadowColor: 'black',
        textShadowRadius: 4,
        textShadowOffset: {
            width: 0,
            height: 0,
        }
    },
});