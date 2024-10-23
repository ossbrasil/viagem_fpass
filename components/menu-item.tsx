import React, {ReactElement} from 'react';
import {Pressable, StyleSheet, Text} from "react-native";
import {IconProps} from "@/components/icon";
import {GestureResponderEvent} from "react-native/Libraries/Types/CoreEventTypes";

export interface MenuItemProps {
    title: string;
    prefixIcon: ReactElement<IconProps>;
    suffixIcon?: ReactElement<IconProps>;
    onClick: (event: GestureResponderEvent) => void | Promise<void>;
}

const MenuItem: React.FC<MenuItemProps> = ({title, prefixIcon, suffixIcon, onClick}) => {
    return (
        <Pressable style={styles.itemContainer} onPress={onClick}>
            {prefixIcon}
            <Text>{title}</Text>
            {suffixIcon}
        </Pressable>
    );
};
const styles = StyleSheet.create({
    itemContainer: {
        paddingHorizontal: 8,
        paddingVertical: 6,
        flexDirection: "row"
    }
});
export default MenuItem;