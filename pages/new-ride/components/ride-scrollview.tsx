import React, {Fragment} from 'react';
import {useNewRide} from "@/pages/new-ride/new-ride-ctx";
import {StyleSheet, Text, View} from "react-native";
import MapSection from "@/components/ride/map-section";
import {Picker} from "@react-native-picker/picker";
import CustomButton, {ButtonType} from "@/components/custom-button";

const RideScrollView = () => {
    const {form} = useNewRide();
    const {values, errors, handleChange, handleSubmit} = form;
    return (
        <Fragment>
            <View style={{flex: 1}}>
                {Boolean(values.distance) && (
                    <View style={{alignItems: "center"}}>
                        <Text style={{
                            fontSize: 16,
                            fontWeight: 700,
                            color: '#444'
                        }}>Distancia: {(values.distance / 1000).toFixed(2)}KM</Text>
                    </View>
                )}
                <MapSection addresses={values.addresses} polyline={values.polyline}/>
                <View style={{
                    height: 55,
                    backgroundColor: '#FFF',
                    shadowColor: '#000',
                    shadowOffset: {width: 0, height: 2},
                    shadowOpacity: 1.0,
                    shadowRadius: 6,
                    elevation: 5,
                    borderRadius: 12,
                    marginBottom: 12,
                    marginHorizontal: 4,
                }}>
                    <Picker
                        selectedValue={values.category}
                        mode={"dropdown"}
                        onValueChange={(itemValue, index) => {
                            handleChange('category', itemValue)
                        }}>
                        {
                            ['Retirada', 'Transferência'].map((item) => (
                                <Picker.Item key={item}
                                             label={item}
                                             value={item}
                                             style={styles.dropdownItemStyle}/>
                            ))
                        }
                    </Picker>
                </View>
            </View>
                <CustomButton
                    title={Object(values).hasOwnProperty('id') ? "Atualizar Viagem" : "Agendar Viagem"}
                    type={ButtonType.MAIN}
                    size="md"
                    onPress={handleSubmit}
                    disabled={(values.addresses !== undefined ? values.addresses.length < 2 : false) || values.employeeId === undefined}
                />
        </Fragment>
    );
};
const styles = StyleSheet.create({
    dropdownItemStyle: {
        width: '100%',
        justifyContent:
            'center',
        alignItems:
            'center',
        paddingVertical:
            8,
    }
    ,
});
export default RideScrollView;