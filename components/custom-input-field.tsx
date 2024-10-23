import React, {ReactElement, useState} from 'react';
import {LayoutChangeEvent, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {IconProps} from "@/components/icon";
import {TextInputProps} from "react-native/Libraries/Components/TextInput/TextInput";

export interface InputFieldProps<T> extends TextInputProps {
    name: string;
    customRef?: React.RefObject<TextInput>
    mask?: (text: string) => string;
    errors?: string;
    prefixIcon?: ReactElement<IconProps>;
    suffixIcon?: ReactElement<IconProps>;
    handleSelect?: (item: T) => void
    renderOption?: (item: T) => string;
    onAutocomplete?: (query: string) => Promise<T[]> | T[];
    handleChangeText?: (name: string, text: string) => void;
}

const CustomInputField = <T, >({
                                   customRef,
                                   name,
                                   mask,
                                   errors,
                                   prefixIcon,
                                   suffixIcon,
                                   handleSelect,
                                   renderOption,
                                   onAutocomplete,
                                   handleChangeText,
                                   ...props
                               }: InputFieldProps<T>) => {
    const [autocompleteResults, setAutocompleteResults] = useState<any[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({top: 0, left: 0, width: 0});

    const onChangeText = async (text: string) => {
        if (mask) text = mask(text);
        if (handleChangeText) handleChangeText(name, text)
        if (onAutocomplete) {
            if (text.length >= 3) {
                const results = await onAutocomplete(text);
                const hasResults = Boolean(results.length);
                setShowDropdown(hasResults);
                if (hasResults) {
                    setAutocompleteResults(results);
                }
            } else {
                setShowDropdown(false)
            }
        }
    };
    const handleSelectSuggestion = async (suggestion: T) => {
        if (suggestion) {
            if (typeof suggestion === 'string') {
                await onChangeText(suggestion);
            } else if (typeof suggestion === 'object') {
                const key = name as keyof T;
                const value = suggestion[key];
                if (value !== undefined) {
                    await onChangeText(String(value));
                }
            }
        }
        if (handleSelect) handleSelect(suggestion)
        setShowDropdown(false);
        setAutocompleteResults([]);
    };
    const handleLayout = (event: LayoutChangeEvent) => {
        const {x, y, width} = event.nativeEvent.layout;
        setDropdownPosition({top: y + 55, left: x, width});
    };

    return (
        <View style={styles.container}>
            <View style={[styles.inputContainer, styles.shadowProps]} onLayout={handleLayout}>
                {prefixIcon}
                <TextInput ref={customRef}
                           style={styles.input}
                           onChangeText={onChangeText}
                           onFocus={() => {
                               if (autocompleteResults.length) {
                                   setShowDropdown(true);
                               }
                           }}
                           onBlur={() => {
                               setShowDropdown(false);
                           }} {...props}/>
                {suffixIcon}
            </View>
            {errors && (
                <View>
                    <Text style={styles.errorText}>{errors}</Text>
                </View>
            )}
            {showDropdown && (
                <View style={[
                    styles.dropdown,
                    {
                        top: dropdownPosition.top,
                        left: dropdownPosition.left,
                        width: dropdownPosition.width,
                    }
                ]}>
                    {autocompleteResults.map((item, idx) => {
                            let text: string;
                            if (renderOption) {
                                text = renderOption(item);
                            } else {
                                text = typeof item === 'string' ? item : item[name]
                            }
                            return (
                                <TouchableOpacity key={'item-' + idx} onPress={() => handleSelectSuggestion(item)}>
                                    <Text numberOfLines={1} style={styles.suggestion}>{text}</Text>
                                </TouchableOpacity>
                            )
                        }
                    )}
                </View>
            )}
        </View>
    );
};

export default CustomInputField;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 12,
        paddingHorizontal: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 55,
        backgroundColor: '#FFF',
    },
    shadowProps: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 1.0,
        shadowRadius: 6,
        elevation: 5,
        borderRadius: 12,
    },
    input: {
        flex: 1,
        paddingLeft: 10,
        fontSize: 20,
    },
    dropdown: {
        position: 'absolute',
        maxHeight: 150,
        backgroundColor: '#fff',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginTop: 5,
        zIndex: 100,
        elevation: 100
    },
    suggestion: {
        padding: 10,
        fontSize: 18,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        fontWeight: 'bold',
        paddingVertical: 6,
        paddingLeft: '2%'
    }
});