import React, {Fragment, useCallback, useState} from 'react';
import {Animated, RefreshControl, Text, View} from "react-native";
import RideCard from "@/components/ride/card/ride-card";
import {Ride} from "@/core/interfaces/ride";
import CustomButton, {ButtonType} from "@/components/custom-button";
import CashModal from "@/components/modal/cash-modal";
import {useShift} from "@/core/context/shift-context";
import ShiftModal from "@/components/modal/shift-modal";
import {useRide} from "@/components/ride/ride-ctx";
import {RideStatuses} from "@/core/enums/ride-status";
import ScrollView = Animated.ScrollView;

const Index = () => {
    const {shift} = useShift();
    const {scheduledRides, setScheduledRides, rideAPI} = useRide();
    const createRideCards = (ride: Ride) => <RideCard key={'schedule' + ride.id} ride={ride}/>;
    const [showShiftModal, setShowShiftModal] = useState(false);
    const [showCashModal, setShowCashModal] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        rideAPI.getManyRides({
            relations: true,
            shiftId: shift!.id,
            status: [
                RideStatuses.SCHEDULED,
                RideStatuses.IN_PROGRESS,
                RideStatuses.DRIVER_EN_ROUTE,
                RideStatuses.DRIVER_ARRIVED,
            ],
            limit: 100,
        }).then((rides) => {
            setScheduledRides(rides);
            setRefreshing(false);
        });
    }, [shift]);
    return (
        <View style={{flex: 1, paddingHorizontal: 8, paddingVertical: 6, justifyContent: 'center'}}>
            {
                shift ? (
                        <Fragment>
                            <View style={{flexDirection: 'row', marginVertical: 6, height: 40}}>
                                <CustomButton
                                    title={'Finalizar Turno'}
                                    type={ButtonType.DANGER}
                                    size="md"
                                    onPress={() => {
                                        setShowShiftModal(true);
                                    }}
                                />
                            </View>
                            <View style={{flex: 1, alignItems: 'center'}}>
                                <Text style={{fontSize: 32, fontWeight: 'bold'}}>Viagens Agendadas</Text>
                                <ScrollView
                                    contentContainerStyle={{flexGrow: 1}}
                                    showsVerticalScrollIndicator={false}
                                    bounces={false}
                                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
                                >
                                    {scheduledRides.map(createRideCards)}
                                </ScrollView>
                            </View>
                            <CustomButton
                                title={'Usar valor caixa'}
                                type={ButtonType.MAIN}
                                size="lg" onPress={() => {setShowCashModal(true)}}/>
                            {showCashModal && (
                                <CashModal showCash={showCashModal} setShowCash={setShowCashModal}/>
                            )}
                        </Fragment>
                    ) :
                    (
                        <CustomButton
                            title={'Inciar Turno'}
                            type={ButtonType.MAIN}
                            size="lg"
                            onPress={() => {
                                setShowShiftModal(true);
                            }}
                        />
                    )
            }
            {showShiftModal && (
                <ShiftModal showShift={showShiftModal} setShowShift={setShowShiftModal}/>
            )}
        </View>
    );
};

export default Index;