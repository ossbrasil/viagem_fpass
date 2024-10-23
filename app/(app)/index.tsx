import React from 'react';
import {Animated, Text, View} from "react-native";
import CustomButton, {ButtonType} from "@/components/custom-button";
import {globalStyles} from "@/core/styles";
import ScrollView = Animated.ScrollView;
import RideCard from "@/components/ride/card/ride-card";
import {Ride} from "@/core/interfaces/ride";
import {useRide} from "@/components/ride/ride-ctx";

const Index = () => {
    const {scheduledRides, rideAPI} = useRide();
    const createRideCards = (ride: Ride) => <RideCard key={'schedule' + ride.id} ride={ride}/>;
    return (
        <View style={{flex: 1, paddingHorizontal: 8, paddingVertical: 6}}>
            <View style={[globalStyles.shadowProps, {
                flexDirection: 'row',
                marginHorizontal: 2,
                marginVertical: 6,
                borderRadius: 8,
                height: 100,
                paddingHorizontal: 10,
                backgroundColor: 'white',
                justifyContent: 'space-between',
                alignItems: 'center'
            }]}>
                <Text style={{fontSize: 32, fontWeight: 'bold'}}>Caixa</Text>
                <Text adjustsFontSizeToFit numberOfLines={1} style={{fontSize: 38, fontWeight: 'bold'}}>R$
                    332.35</Text>
            </View>
            <View style={{flex: 1, alignItems: 'center'}}>
                <Text style={{fontSize: 32, fontWeight: 'bold'}}>Viagens Agendadas</Text>
                <ScrollView
                    contentContainerStyle={{flexGrow: 1}}
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                >
                    {scheduledRides.map(createRideCards)}
                </ScrollView>
            </View>
            <View style={{height: 60}}>
                <CustomButton title={'Iniciar Turno'} type={ButtonType.MAIN} size="lg" onPress={() => {}}/>
            </View>
        </View>
    );
};

export default Index;