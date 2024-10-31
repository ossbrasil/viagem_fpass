import React, {useState} from 'react';
import {Image, StyleSheet, Text, View} from "react-native";
import CustomInputField from "@/components/custom-input-field";
import CustomButton, {ButtonType} from "@/components/custom-button";
import * as ImagePicker from 'expo-image-picker';
import {CreateShiftAction} from "@/common/services/app/shifts/dto/create-shift-action";
import {useShift} from "@/core/context/shift-context";
import useForm, {FormErrors} from "@/hooks/useForm";
import {globalStyles} from "@/core/styles";
import CustomModal from "@/components/modal/modal";

export interface CashModalProps {
    showCash: boolean;
    setShowCash: React.Dispatch<React.SetStateAction<boolean>>;
}
const CashModal = ({showCash, setShowCash}:CashModalProps) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const {shiftAPI, shift} = useShift();

    const pickImage = async () => {
        // Request camera roll permissions
        const {status} = await ImagePicker.requestCameraPermissionsAsync();
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
    const initialValues: CreateShiftAction = {
        shiftId: shift!.id,
        actionType: 'WITHDRAWN',
        value: 0,
        description: ''
    }
    const onSubmit = async (value: CreateShiftAction) => {
        // const formData = new FormData();
        // formData.append("data", JSON.stringify(value));
        // if (selectedImage) {
        //     const imageName = selectedImage.split('/').pop(); // Extract the file name
        //     formData.append("image", {
        //         uri: selectedImage,
        //         name: imageName,
        //         type: 'image/jpeg', // Adjust based on your file type
        //     } as any);
        // }
        const res = await shiftAPI.createShiftAction(shift!.id, value)
        if(res){
            setShowCash(false);
        }
    }
    const validate = (value: CreateShiftAction) => {
        let errors: FormErrors<CreateShiftAction> = {};
        if (!value.value) {
            errors.value = 'Valor é obrigatório'
        }
        if (!value.description) {
            errors.description = 'Descrição é obrigatório'
        }
        return errors
    }
    const form = useForm<CreateShiftAction>({initialValues, onSubmit, validate});
    return (
        <CustomModal isOpen={showCash} setIsOpen={setShowCash}>
            <View style={[globalStyles.shadowProps, styles.container]}>
                <Text style={{fontSize: 22, fontWeight: 'bold'}}>Registro de caixa</Text>
                <CustomInputField
                    name={'value'}
                    placeholder={'Valor usado'}
                    value={form.values.value?form.values.value.toString().replace(/,/g, "."):''}
                    errors={form.errors.value}
                    handleChangeText={form.handleChange}
                    keyboardType="numeric"
                />
                <CustomInputField
                    name={'description'}
                    placeholder={'Descrição'}
                    multiline
                    value={form.values.description}
                    errors={form.errors.description}
                    handleChangeText={form.handleChange}

                />
                <View style={{flexDirection: 'row', height: 40, marginBottom: 8}}>
                    <CustomButton
                        disabled={true}
                        title={'Enviar Comprovante'}
                        type={ButtonType.MAIN}
                        size="md"
                        onPress={pickImage}
                    />
                </View>
                {selectedImage && (
                    <Image
                        source={{uri: selectedImage}}
                        style={{width: 200, height: 200, marginVertical: 8}}
                    />
                )}
                <View style={{flexDirection: 'row', height: 40}}>
                    <CustomButton
                        title={'Cancelar'}
                        type={ButtonType.DANGER}
                        size="md"
                        onPress={() => {setShowCash(false)}}
                    />
                    <CustomButton
                        title={'Confirmar'}
                        type={ButtonType.SUCCESS}
                        size="md"
                        onPress={form.handleSubmit}
                    />
                </View>
            </View>
        </CustomModal>
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