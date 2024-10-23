import React from 'react';
import {Pressable, StyleSheet, Text, View} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {ButtonType} from "@/components/custom-button";
import {Ride} from "@/core/interfaces/ride";
import {RideStatuses} from "@/core/enums/ride-status";
import {formatDateString} from "@/common/parsers/parse-date-string";
import CardContent from "@/components/ride/card/card";

export interface RideCardProps {
    ride: Ride;
}

const RideCard: React.FC<RideCardProps> = ({ride}) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const statusColor = (): ButtonType => {
        switch (ride.status) {
            case RideStatuses.SCHEDULED:
                return ButtonType.INFO;
            case RideStatuses.IN_PROGRESS:
            case RideStatuses.DRIVER_EN_ROUTE:
            case RideStatuses.DRIVER_ARRIVED:
            case RideStatuses.COMPLETED:
                return ButtonType.SUCCESS;
            default:
                return ButtonType.DANGER;
        }
    }
    return (
        <View style={styles.ridesContent}>
            <Pressable
                onPress={() => setIsOpen(!isOpen)}
                style={styles.rideCardHeader}
            >
                <Text numberOfLines={1} style={styles.ridesTitle}>{formatDateString(ride.expectedDepartureTime!)} -
                    ID: {ride.id}</Text>
                <View style={statusStyles(statusColor()).status}/>
                <MaterialIcons name={!isOpen ? 'keyboard-arrow-down' : 'keyboard-arrow-up'} size={28} color="#FFF"/>
            </Pressable>
            {isOpen && (<CardContent ride={ride}/>)}
        </View>
    );
};
const statusStyles = (status: ButtonType) => StyleSheet.create({
    status: {
        height: 28,
        width: 28,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: '#FFF',
        backgroundColor: status
    }
})
const styles = StyleSheet.create({
    rideCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: 45
    },
    ridesContent: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingHorizontal: 10,
        width: '100%',
        backgroundColor: '#000',
        borderRadius: 8,
        marginVertical: 4,
    },
    ridesTitle: {
        flex: 1,
        fontWeight: 'bold',
        color: '#FFF',
        fontSize: 18
    },
    rideRiderContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    rideRiderCardContainer: {
        flex: 1,
        paddingHorizontal: 4,
    },
    rideRiderCardContent: {
        height: 45,
        backgroundColor: '#FFF',
        borderRadius: 6,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 5,
    },
    rideRiderCardTextContainer: {
        paddingLeft: 10,
        justifyContent: 'space-around'
    },
    rideRiderCardText: {
        fontWeight: 'bold',
    }
});
export default RideCard;