import {RideStatuses} from "@/core/enums/ride-status";

export interface FetchManyRides {
    startTime?: number;
    endTime?: number;
    employeeId?: number;
    shiftId?: number;
    category?: string;
    status?: RideStatuses[];
    fields?: ValidFetchManyRidesField[];
    relations?: boolean;
}

export type ValidFetchManyRidesField =
    'id' |
    'category' |
    'description' |
    'expectedDepartureTime' |
    'expectedFinishTime' |
    'startTime' |
    'endTime' |
    'driverId' |
    'towPlate' |
    'carPlate1' |
    'carPlate2' |
    'status' |
    'polylines' |
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