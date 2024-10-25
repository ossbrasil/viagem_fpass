import React, {useState} from 'react';
import {StyleSheet, Text, View, Image} from "react-native";
import CustomInputField from "@/components/custom-input-field";
import CustomButton, {ButtonType} from "@/components/custom-button";
import {useModal} from "@/core/context/modal-context";
import * as ImagePicker from 'expo-image-picker';

const CashModal = () => {
    const {closeModal} = useModal();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const pickImage = async () => {
        // Request camera roll permissions
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
            return;
        }

        // Open image picker and allow selecting an image
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri); // Set the selected image URI
        }
    };
    return (
        <View style={styles.container}>
            <Text style={{fontSize: 22, fontWeight: 'bold'}}>Registro de caixa</Text>
            <CustomInputField
                name={'cash'}
                placeholder={'Valor usado'}
            />
            <CustomInputField
                name={'desc'}
                placeholder={'Descrição'}
                multiline
            />
            <View style={{flexDirection: 'row', height: 40, marginBottom: 8}}>
                <CustomButton
                    title={'Enviar Comprovante'}
                    type={ButtonType.MAIN}
                    size="md"
                    onPress={pickImage}
                />
            </View>
            {selectedImage && (
                <Image
                    source={{ uri: selectedImage }}
                    style={{ width: 200, height: 200, marginVertical: 8 }}
                />
            )}
            <View style={{flexDirection: 'row', height: 40}}>
                <CustomButton
                    title={'Cancelar'}
                    type={ButtonType.DANGER}
                    size="md"
                    onPress={() => {closeModal('cash')}}
                />
                <CustomButton
                    title={'Confirmar'}
                    type={ButtonType.SUCCESS}
                    size="md"
                    onPress={() => {}}
                />
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        top: '25%',
        marginHorizontal: '12.5%',
        padding: 10,
        backgroundColor: '#FFF',
        borderRadius: 8,
    }
});

export default CashModal;