import React, {FC} from 'react';
import {KeyboardAvoidingView, StyleSheet, Text, View} from "react-native";
import {RootStackParamList} from "@/app/(app)/_layout";
import {RouteProp} from "@react-navigation/core";
import Addresses from "@/pages/new-ride/components/addresses";
import RideScrollView from "@/pages/new-ride/components/ride-scrollview";
import {NewRideProvider} from "@/pages/new-ride/new-ride-ctx";

export interface NewRideProps {
    route: RouteProp<RootStackParamList, 'new-ride'>
}
const NewRide: FC<NewRideProps> = ({route}) => {
    return (
        <NewRideProvider>
            <View style={styles.container}>
                <View style={{flexDirection: "row", justifyContent: "center"}}>
                    <Text style={{fontSize: 22, fontWeight: 'bold', marginVertical: 6}}>Nova Viagem</Text>
                </View>
                <Addresses/>
                <View style={{flex: 1, paddingTop: 6}}>
                    <KeyboardAvoidingView style={{flex: 1}}>
                        <RideScrollView/>
                    </KeyboardAvoidingView>
                </View>
            </View>
        </NewRideProvider>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent:
            'flex-start',
        paddingHorizontal:
            10,
        backgroundColor:
            '#EEE'
    },
    commonText: {
        fontSize: 16,
        fontWeight: 700,
        color: '#444'
    },
    pickerInput: {
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
    },
    dropdownItemStyle: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
    },
});
export default NewRide;
