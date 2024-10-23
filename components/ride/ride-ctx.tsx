import React, {useEffect, useMemo, useState} from "react";
import {Ride} from "@/core/interfaces/ride";
import {RideStatuses} from "@/core/enums/ride-status";
import {IRideAPI, RideAPI} from "@/common/services/app/rides/ride-api";
import {useSocket} from "@/core/context/socketio-context";
import {AccessLevel} from "@/core/enums/access-level";
import {useApp} from "@/core/context/app-context";
import {HttpService} from "@/core/shared/http-service";
import {useNavigation} from "expo-router";
import {NavigationProp} from "@/app/(app)/_layout";


export interface RideContextValues {
    historyRides: Ride[];
    scheduledRides: Ride[];
    rideAPI: IRideAPI;
    setHistoryRides: React.Dispatch<React.SetStateAction<Ride[]>>;
    setScheduledRides: React.Dispatch<React.SetStateAction<Ride[]>>;
    updateRides: (id: number, ride: Partial<Ride>) => Promise<void>
}

const defaultValue: RideContextValues = {
    historyRides: [],
    scheduledRides: [],
    rideAPI: new RideAPI({} as HttpService),
    setScheduledRides: () => {},
    setHistoryRides: () => {},
    updateRides: async () => {},
}
const RideContext = React.createContext<RideContextValues>(defaultValue);
export const useRide = () => React.useContext(RideContext);

export const RideProvider: React.FC<React.PropsWithChildren> = ({children}) => {
    const {server} = useSocket();
    const {session, httpService} = useApp();
    const {navigate} = useNavigation<NavigationProp>();
    const [scheduledRides, setScheduledRides] = useState<Ride[]>([]);
    const [historyRides, setHistoryRides] = useState<Ride[]>([]);
    const rideAPI = new RideAPI(httpService)
    const updateRides = async (id: number, updatedRide: Partial<Ride>) => {
        const success = await rideAPI.updateRide(id, updatedRide);
        if (!success) return;
        if (updatedRide.status) {
            let shallowRideCopy: Ride[] = [];
            let selectedRide: Ride | undefined;
            switch (updatedRide.status) {
                // Update Status
                case RideStatuses.SCHEDULED:
                    console.log(scheduledRides);
                    shallowRideCopy = [...scheduledRides];
                    shallowRideCopy.forEach((f) => {
                        if (f.id !== id) return;
                        f.status = RideStatuses.SCHEDULED;
                    });
                    console.log(shallowRideCopy);
                    setScheduledRides(shallowRideCopy);
                    break;
                case RideStatuses.DRIVER_EN_ROUTE:
                case RideStatuses.DRIVER_ARRIVED:
                case RideStatuses.IN_PROGRESS:
                    shallowRideCopy = [...scheduledRides];
                    selectedRide = shallowRideCopy.find(ride => ride.id === id)
                    if (!selectedRide)
                        break;
                    selectedRide.status = updatedRide.status;
                    setScheduledRides([...shallowRideCopy]);
                    //navigation.navigate('current-ride');
                    break;
                case RideStatuses.COMPLETED:
                case RideStatuses.CANCELLED:
                    shallowRideCopy = [...scheduledRides];
                    const rideIndex = scheduledRides.findIndex(ride => ride.id === id);
                    selectedRide = shallowRideCopy[rideIndex];
                    shallowRideCopy.splice(rideIndex, 1);
                    setScheduledRides(shallowRideCopy);
                    if (selectedRide) {
                        selectedRide.status = updatedRide.status;
                        shallowRideCopy = [...historyRides, selectedRide];
                        setHistoryRides(shallowRideCopy)
                    }
                    break;
            }
        }
    };
    const handleRideUpdateEvent = (payload: { id: number, ride: Ride }) => {
        console.log(payload);
        if (payload.ride.status && [RideStatuses.COMPLETED, RideStatuses.CANCELLED].includes(payload.ride.status)) {
            let ride: Ride | undefined = undefined;
            setScheduledRides((prevState) => {
                const rideId = prevState.findIndex((r) => r.id === payload.id);
                if (rideId === -1) return prevState;
                const newState = [...prevState];
                ride = {...newState[rideId]};
                newState.splice(rideId, 1)
                return newState;
            });
            if (ride !== undefined) {
                setHistoryRides((prevState) => {
                    const newState = [...prevState];
                    ride!.status = payload.ride.status;
                    newState.push(ride!)
                    return newState;
                });
            }
        } else {
            setScheduledRides((prevState) => {
                const newState = [...prevState];
                const ride = newState.find((r) => r.id === payload.id);
                if (ride)
                    ride.status = payload.ride.status;
                return newState;
            });
        }
    }
    useEffect(() => {
        rideAPI.getManyRides({relations: true})
            .then((rides) => {
                const [sRides, hRides] = rides.reduce(([sRides, hRides]: [Ride[], Ride[]], ride) => {
                        if ([RideStatuses.COMPLETED, RideStatuses.CANCELLED].includes(ride.status!)) hRides.push(ride)
                        else sRides.push(ride);
                        if (session?.user.accessLevel === AccessLevel.DRIVER
                            && [RideStatuses.IN_PROGRESS, RideStatuses.DRIVER_EN_ROUTE, RideStatuses.DRIVER_EN_ROUTE].includes(ride.status!))
                            navigate('current-ride', {id: ride.id})
                        return [sRides, hRides]
                    }, [[], []],
                );
                setScheduledRides(sRides);
                setHistoryRides(hRides);
            });
        server.on('rideUpdate', handleRideUpdateEvent)
    }, []);
    const value = useMemo(() => {
        return {
            historyRides,
            scheduledRides,
            rideAPI,
            setScheduledRides,
            setHistoryRides,
            updateRides,
        };
    }, [historyRides, scheduledRides]);

    return (
        <RideContext.Provider value={value}>
            {children}
        </RideContext.Provider>
    );
}
