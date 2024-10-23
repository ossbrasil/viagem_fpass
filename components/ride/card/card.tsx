import React, {FC, Fragment} from "react";
import {useApp} from "@/core/context/app-context";
import {useRide} from "@/components/ride/ride-ctx";
import {useNavigation} from "expo-router";
import {NavigationProp} from "@/app/(app)/_layout";
import {AccessLevel} from "@/core/enums/access-level";
import CustomButton, {ButtonProps, ButtonType} from "@/components/custom-button";
import {RideStatuses} from "@/core/enums/ride-status";
import {Ride} from "@/core/interfaces/ride";
import {View, Text} from "react-native";
import RideTime from "@/components/ride/card/expect-time";
import StaticAddress from "@/components/ride/card/static-address";
import MapSection from "@/components/ride/map-section";

export interface ContentProps {
    ride: Ride;
    current?: boolean;
}

const CardContent: FC<ContentProps> = ({ride}) => {
    const {session} = useApp();
    const {updateRides} = useRide();
    const {navigate} = useNavigation<NavigationProp>();
    const setActionButtons = () => {
        let buttons: ButtonProps[] = [];
        if (session?.user.accessLevel !== AccessLevel.ADMIN) {
            switch (ride.status) {
                case RideStatuses.SCHEDULED:
                    buttons.push(
                        {
                            title: "Cancelar Viagem", type: ButtonType.DANGER, size: "md",
                            onPress: () => updateRides(ride.id, {status: RideStatuses.CANCELLED})
                        },
                        {
                            title: "Iniciar Viagem", type: ButtonType.SUCCESS, size: "md",
                            onPress: () => {
                                // updateRides(ride.id, {
                                //     status: RideStatuses.DRIVER_EN_ROUTE,
                                //     startTime: new Date().getTime()
                                // })
                                navigate('current-ride')
                            }
                        },
                    );
                    break;
                case RideStatuses.DRIVER_EN_ROUTE:
                    buttons.push({
                        title: "Cheguei ao Local de retirada", type: ButtonType.SUCCESS, size: "md",
                        onPress: () => updateRides(ride.id, {status: RideStatuses.DRIVER_ARRIVED})
                    });
                    break;
                case RideStatuses.DRIVER_ARRIVED:
                    buttons.push({
                        title: "Veículo Retirado", type: ButtonType.SUCCESS, size: "md",
                        onPress: () => updateRides(ride.id, {status: RideStatuses.IN_PROGRESS})
                    });
                    break;
                case RideStatuses.IN_PROGRESS:
                    buttons.push({
                        title: "Completar Viagem", type: ButtonType.SUCCESS, size: "md",
                        onPress: () => updateRides(ride.id, {
                            status: RideStatuses.COMPLETED,
                            endTime: new Date().getTime()
                        })
                    });
                    break;
                case RideStatuses.COMPLETED:
                case RideStatuses.CANCELLED:
                    break;
            }
        }
        return <Fragment>
            {buttons.map((b, idx) => <CustomButton key={'b' + ride.id + idx} {...b} />)}
        </Fragment>

    };
    return (
        <View style={{paddingBottom: 10, width: '100%'}}>
            <RideTime startTime={ride.expectedDepartureTime} endTime={ride.expectedFinishTime}/>
            {(Boolean(ride.startTime) && Boolean(ride.endTime)) &&
                <RideTime startTime={ride.startTime} endTime={ride.endTime} completed/>
            }
            {Boolean(ride.distance) && (
                <View style={{alignItems: "center"}}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: '#FAFAFA'
                    }}>Distancia: {(ride.distance / 1000).toFixed(2)}KM</Text>
                </View>
            )}
            <StaticAddress addresses={ride.addresses}/>
            <MapSection addresses={ride.addresses} polyline={ride.polyline}/>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginTop: 5
            }}>
                {setActionButtons()}
            </View>
        </View>
    );
}
export default CardContent;
