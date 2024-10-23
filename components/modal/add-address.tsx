import React from 'react';
import CustomModal from "@/components/modal/modal";
import {globalStyles} from "@/core/styles";
import {StyleSheet, Text, View} from "react-native";
import CustomInputField from "@/components/custom-input-field";
import CustomButton, {ButtonType} from "@/components/custom-button";
import {Address, RideAddressTypeEnum} from "@/core/interfaces/ride";
import useForm, {FormErrors} from "@/hooks/useForm";
import {parseCEP} from "@/common/parsers/parse-cep";
import {useNewRide} from "@/pages/new-ride/new-ride-ctx";

export interface AddAddressProps {
    showAddress: boolean;
    setShowAddress: React.Dispatch<React.SetStateAction<boolean>>
    addressIdx?: number;
}

const AddAddressModal = ({showAddress, setShowAddress, addressIdx}: AddAddressProps) => {
        const {form, rideAPI} = useNewRide();
        const initialValues: Address = addressIdx ? {...form.values.addresses[addressIdx]} : {
            street: '',
            number: 0,
            cep: '',
            neighbourhood: '',
            city: '',
            uf: '',
        };
        const onSubmit = async () => {
            values.number = +values.number;
            const {
                id,
                rideId,
                expectedArrivalTime,
                lat,
                lng,
                rideAddressType,
                stopOrder,
                ...data
            } = values;
            if (!data.complement) delete data.complement;

            const geoDecodedAddress = await rideAPI.geoDecode(data);
            if (!geoDecodedAddress) return;
            let addresses: Address[] = [...form.values.addresses];

            if (addresses.length !== 0) {
                const departureTime = form.values.expectedDepartureTime ?? new Date().getTime();
                if (addressIdx === undefined) {
                    if (addresses.length > 1) {
                        addresses[addresses.length - 1].rideAddressType = RideAddressTypeEnum.ADDITIONAL;
                    }
                    addresses.push({
                        ...geoDecodedAddress,
                        stopOrder: addresses.length,
                        rideAddressType: RideAddressTypeEnum.FINISH,
                    });
                } else {
                    addresses.splice(addressIdx, 1)
                    addresses.push({...geoDecodedAddress, rideAddressType});
                }
                const route = await rideAPI.getRoute(departureTime, addresses.map(({lat, lng, rideAddressType}) => ({
                    lat,
                    lng,
                    rideAddressType
                })));
                route!.addresses = route!.addresses.map((a, i) => ({...addresses[i], ...a}))
                form.setValues(prevState => {
                    return {
                        ...prevState,
                        ...route
                    }
                });
            } else if (addressIdx !== undefined) {
                addresses[addressIdx] = geoDecodedAddress;
                form.setValues(prevState => ({
                    ...prevState,
                    addresses,

                }));

            } else {
                addresses.push({
                    ...geoDecodedAddress,
                    stopOrder: 0,
                    rideAddressType: RideAddressTypeEnum.START,
                });
                form.setValues(prevState => ({
                    ...prevState,
                    addresses,

                }));
            }
            setShowAddress(false);
        }
        const validate = (values: Address) => {
            let errors: FormErrors<Address> = {};
            if (!values.number) {
                errors.number = "Número é obrigatório";
            }
            if (!values.cep) {
                errors.cep = "CEP é obrigatório";
            }
            if (!values.neighbourhood) {
                errors.neighbourhood = "Bairro é obrigatório"
            }
            if (!values.street) {
                errors.street = "Logradouro é obrigatório"
            }
            if (!values.city) {
                errors.city = "Cidade é obrigatório"
            }
            if (!values.uf) {
                errors.uf = "UF é obrigatório"
            }
            return errors
        }
        const {values, errors, handleChange, handleSubmit, setValues} = useForm<Address>({
            initialValues,
            onSubmit,
            validate,
        });
        const onAutoCompleteCEP = async (query: string) => {
            const cep = parseCEP(query, true);
            if (cep.length === 8) {
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json`);
                if (!response.ok) {
                    return [];
                }
                const data = await response.json();
                if (data?.erro === "true") {
                    return [];
                }
                return [{
                    cep: parseCEP(data.cep, true),
                    street: data.logradouro,
                    neighbourhood: data.bairro,
                    city: data.localidade,
                    uf: data.uf
                }] as Address[];

            }
            return [];
        }
        const handleSelectionCEP = (item: Address) => {
            const updatedValues = {...values, ...item}
            setValues(updatedValues)
        }
        return (
            <CustomModal isOpen={showAddress} setIsOpen={setShowAddress}>
                <View style={[styles.container, globalStyles.shadowProps]}>
                    <Text style={styles.titleText}>Adicionar Endereço</Text>
                    <CustomInputField
                        name="street"
                        placeholder={'Logradouro'}
                        value={values.street}
                        errors={errors.street}
                        handleChangeText={handleChange}
                    />
                    <View style={{flexDirection: 'row'}}>
                        <View style={{flex: 1}}>
                            <CustomInputField
                                name="number"
                                placeholder={"Número"}
                                value={values.number ? values.number.toString() : ''}
                                errors={errors.number}
                                handleChangeText={handleChange}
                                keyboardType={'numeric'}
                            />
                        </View>
                        <View style={{flex: 1}}>
                            <CustomInputField
                                name="cep"
                                placeholder={"CEP"}
                                value={values.cep ? parseCEP(values.cep) : values.cep}
                                errors={errors.cep}
                                handleChangeText={handleChange}
                                keyboardType={'numeric'}
                                onAutocomplete={onAutoCompleteCEP}
                                handleSelect={handleSelectionCEP}
                                maxLength={9}
                                renderOption={(item) => (
                                    `${item.street} - ${item.neighbourhood} ${item.city}, ${item.uf}`
                                )}
                            />
                        </View>
                    </View>
                    <CustomInputField
                        name="complement"
                        placeholder={"Complemento"}
                        value={values.complement ?? ''}
                        errors={errors.complement}
                        handleChangeText={handleChange}
                    />
                    <CustomInputField
                        name="neighbourhood"
                        placeholder={"Bairro"}
                        value={values.neighbourhood}
                        errors={errors.neighbourhood}
                        handleChangeText={handleChange}
                    />
                    <View style={{flexDirection: 'row'}}>
                        <View style={{flex: 1}}>
                            <CustomInputField
                                name="city"
                                placeholder={"Cidade"}
                                value={values.city}
                                errors={errors.city}
                                handleChangeText={handleChange}
                            />
                        </View>
                        <View style={{flex: 1}}>
                            <CustomInputField
                                name="uf"
                                placeholder={"UF"}
                                value={values.uf}
                                errors={errors.uf}
                                handleChangeText={handleChange}
                            />
                        </View>
                    </View>
                    <View style={{flexDirection: 'row', paddingBottom: 6}}>
                        <CustomButton title={'Cancelar'} type={ButtonType.DANGER} size={'md'}
                                      onPress={() => {
                                          if (addressIdx != undefined)
                                              setShowAddress(false);
                                      }}/>
                        <CustomButton title={'Confirmar'} type={ButtonType.SUCCESS} size={'md'} onPress={handleSubmit}/>
                    </View>
                </View>
            </CustomModal>
        );
    }
;
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginHorizontal: 10,
        padding: 10,
        backgroundColor: 'rgba(234,234,234,0.9)',
        borderRadius: 8,
        top: '10%'
    },
    titleText: {
        fontSize: 22,
        fontWeight: 'bold',
        paddingVertical: 5
    },
});
export default AddAddressModal;