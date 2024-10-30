import React, {useCallback, useState} from 'react';
import {RefreshControl, ScrollView, StyleSheet, Text, View} from "react-native";
import {useRide} from "@/components/ride/ride-ctx";
import RideCard from "@/components/ride/card/ride-card";
import {Ride} from "@/core/interfaces/ride";
import {RideStatuses} from "@/core/enums/ride-status";

const HistRide = () => {
    const {historyRides, rideAPI, setHistoryRides} = useRide();
    const [refreshing, setRefreshing] = useState(false);
    const createRideCards = (ride: Ride) => <RideCard key={'history' + ride.id} ride={ride}/>;
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        rideAPI.getManyRides({
            relations: true,
            status: [RideStatuses.COMPLETED, RideStatuses.CANCELLED]
        }).then((rides) => {
            setHistoryRides(rides);
            setRefreshing(false);
        });
    }, []);
    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={{flexGrow: 1}}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}/>
                }
                showsVerticalScrollIndicator={false}
                bounces>
                <View style={styles.ridesContainer}>
                    <Text style={styles.ridesTitle}>Histórico de viagens</Text>
                    {historyRides.map(createRideCards)}
                </View>
            </ScrollView>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#FFF'
    },
    ridesContainer: {
        flex: 1,
        width: '100%',
        paddingHorizontal: 10,
        marginBottom: '5%',
        borderRadius: 8,
        alignItems: 'center',
    },
    ridesTitle: {
        fontSize: 22,
        fontWeight: 'bold',
    },
});
export default HistRide;