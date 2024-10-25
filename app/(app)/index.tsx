import React, {Fragment} from 'react';
import {Animated, Text, View} from "react-native";
import RideCard from "@/components/ride/card/ride-card";
import {Ride} from "@/core/interfaces/ride";
import {useModal} from "@/core/context/modal-context";
import CustomButton, {ButtonType} from "@/components/custom-button";
import CashModal from "@/components/modal/cash-mdal";
import {useShift} from "@/core/context/shift-context";
import ShiftModal from "@/components/modal/shift-modal";

const Index = () => {
    //const {scheduledRides, rideAPI} = useRide();
    const {shift} = useShift();
    const {openModal} = useModal();
    const createRideCards = (ride: Ride) => <RideCard key={'schedule' + ride.id} ride={ride}/>;
    return (
        <View style={{flex: 1, paddingHorizontal: 8, paddingVertical: 6, justifyContent: 'center'}}>
            {
                shift ? (
                        <Fragment>
                            <View style={{flex: 1, alignItems: 'center'}}>
                                <Text style={{fontSize: 32, fontWeight: 'bold'}}>Viagens Agendadas</Text>
                                {/*<ScrollView*/}
                                {/*    contentContainerStyle={{flexGrow: 1}}*/}
                                {/*    showsVerticalScrollIndicator={false}*/}
                                {/*    bounces={false}*/}
                                {/*>*/}
                                {/*    {scheduledRides.map(createRideCards)}*/}
                                {/*</ScrollView>*/}
                            </View>
                            <CustomButton
                                title={'Usar Caixa'}
                                type={ButtonType.MAIN}
                                size="lg" onPress={() => {openModal('cash', <CashModal/>)}}/>
                        </Fragment>
                    ) :
                    (
                        <CustomButton
                            title={'Inciar Turno'}
                            type={ButtonType.MAIN}
                            size="lg"
                            onPress={() => {
                                openModal('shift', <ShiftModal/>)
                            }}
                        />
                    )
            }

        </View>
    );
};

export default Index;