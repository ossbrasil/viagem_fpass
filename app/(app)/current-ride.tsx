import React from 'react';
import {Animated, StyleSheet, Text, View} from "react-native";
import {useLocalSearchParams} from "expo-router";
import {useRide} from "@/components/ride/ride-ctx";
import CardContent from "@/components/ride/card/card";
import ScrollView = Animated.ScrollView;

const CurrentRide = () => {
    const {id} = useLocalSearchParams<{ id: string }>();
    const {scheduledRides} = useRide();
    console.log(id);
    return (
        <View style={{flex: 1, paddingHorizontal: 10, backgroundColor: "#AAA"}}>
            <ScrollView style={{width: '100%'}} showsVerticalScrollIndicator={false}>
                <View style={{alignItems: 'center',}}>
                    <Text style={styles.ridesTitle}>Viagem Atual</Text>
                    {
                        <CardContent ride={scheduledRides.find((ride) => ride.id === +id)!} current/>
                    }
                </View>
            </ScrollView>
        </View>
    );
};
const styles = StyleSheet.create({
    ridesTitle: {
        fontSize: 22,
        fontWeight: 'bold',
    },
})
export default CurrentRide;