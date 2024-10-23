export interface FetchManyVehicles {
    plate?: string,
    fields?: ValidFetchManyVehiclesField[];
    relations?: boolean;
}

export type ValidFetchManyVehiclesField =
    'id' |
    'plate' |
    'color' |
    'model' |
    'ride.id' |
    'ride.category' |
    'ride.description' |
    'ride.expectedDepartureTime' |
    'ride.expectedFinishTime' |
    'ride.startTime' |
    'ride.endTime' |
    'ride.driverId' |
    'ride.towPlate' |
    'ride.carPlate1' |
    'ride.carPlate2' |
    'ride.status' |
    'ride.polylines' |
    'address.shouldWait' |
    'address.waitFor' |
    'address.expectedArrivalTime' |
    'address.cep' |
    'address.street' |
    'address.number' |
    'address.complement' |
    'address.neighbourhood' |
    'address.city' |
    'address.uf' |
    'address.lat' |
    'address.lng' |
    'address.stop_order' |
    'address.rideAddressType' |
    'driver.access_level' |
    'driver.cpf' |
    'driver.name' |
    'driver.email';