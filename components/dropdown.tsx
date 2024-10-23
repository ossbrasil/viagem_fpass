import React, {ReactElement} from 'react';
import {FlatList, StyleSheet, View} from "react-native";

export interface DropdownProps {
    items: ReactElement[];

}

const Dropdown: React.FC<DropdownProps> = ({items}) => {
    return (
        <View
            style={[styles.dropdown]}
        >
            <FlatList
                data={items}
                keyExtractor={(item, index) => `menu-${index}`}
                renderItem={({item}) => item}
            />
        </View>
    );
};
const styles = StyleSheet.create({
    dropdown: {
        position: 'absolute',
        right: 8,
        top: 100,
        backgroundColor: '#fff',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 4,
        marginTop: 5,
        zIndex: 1,
        elevation: 100
    },
});
export default Dropdown;