import React from 'react';
import {StyleSheet, Text, View} from "react-native";
import {globalStyles} from "@/core/styles";
import CustomInputField from "@/components/custom-input-field";
import CustomButton, {ButtonType} from "@/components/custom-button";
import {CreateShift} from "@/common/services/app/shifts/dto/create-shift.input";
import useForm, {FormErrors} from "@/hooks/useForm";
import {useShift} from "@/core/context/shift-context";
import CustomModal from "@/components/modal/modal";


export interface ShiftModalProps {
    showShift: boolean;
    setShowShift: React.Dispatch<React.SetStateAction<boolean>>
}

const ShiftModal = ({showShift, setShowShift}: ShiftModalProps) => {

    const {shift, shiftAPI, setShift} = useShift();
    const initialValues: CreateShift = {
        openingCash: 0
    }
    const onSubmit = async (value: CreateShift) => {
        if (shift) {
            const closingValue = {closingCash: value.openingCash}
            const res = await shiftAPI.updateShift(shift!.id, closingValue);
            console.log(res);
            setShift(null);
        } else {
            const res = await shiftAPI.createShift(value);
            console.log(res);
            setShift({...res, rides: []})
        }
        setShowShift(false);
    }
    const validate = (value: CreateShift) => {
        let errors: FormErrors<CreateShift> = {};
        if (!value.openingCash) {
            errors.openingCash = 'Valor em caixa é obrigatório'
        }
        return errors;
    }
    const form = useForm<CreateShift>({initialValues, onSubmit, validate})
    return (
        <CustomModal isOpen={showShift} setIsOpen={setShowShift}>
            <View style={[globalStyles.shadowProps, styles.container]}>
                <Text style={styles.title}>{shift ? 'Encerrar' : 'Iniciar'} Turno</Text>
                <Text style={styles.subTitle}>Informe o valor atual em caixa</Text>
                <CustomInputField
                    name={'openingCash'}
                    value={form.values.openingCash ? form.values.openingCash.toString().replace(/,/g, ".") : ''}
                    errors={form.errors.openingCash}
                    handleChangeText={form.handleChange}
                    placeholder="Valor em caixa"
                    keyboardType="numeric"
                />
                <View style={{flexDirection: 'row', height: 40}}>
                    <CustomButton
                        title={'Cancelar'}
                        type={ButtonType.DANGER}
                        size="md"
                        onPress={() => {setShowShift(false)}}
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
        justifyContent: 'flex-start',
        top: '25%',
        marginHorizontal: '12.5%',
        padding: 10,
        backgroundColor: '#FFF',
        borderRadius: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subTitle: {
        fontSize: 16,
        fontWeight: '700',
        paddingHorizontal: 10,
        textAlign: 'center',
        paddingBottom: 10,
    }
})
export default ShiftModal;