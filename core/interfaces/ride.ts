import {RideStatuses} from "@/core/enums/ride-status";

export interface CreateRideDto {
    expectedDepartureTime: number;
    expectedFinishTime: number;
    status?: RideStatuses;
    employeeId: number;
    category: string;
    employee?: Driver;
    addresses: Address[];
    polyline: string[];
    distance: number;
    shiftId: number;
}

export interface Ride extends CreateRideDto {
    id: number;
    startTime: number;
    endTime: number;
    driver: Driver;
}

export interface Driver {
    name?: string;
    cpf?: string;
    email?: string;
}

export interface Address extends Coordinates {
    id?: number;
    rideId?: number;
    expectedArrivalTime?: number;
    cep: string;
    street: string;
    number: number;
    complement?: string | null;
    neighbourhood: string;
    city: string;
    uf: string;
    stopOrder?: number;
    rideAddressType?: RideAddressTypeEnum;
}

export interface HereRoute extends Coordinates {
    rideAddressType?: RideAddressTypeEnum;
}

export interface Coordinates {
    lat?: number;
    lng?: number;
}

export enum RideAddressTypeEnum {
    START = 'START',
    ADDITIONAL = 'ADDITIONAL',
    FINISH = 'FINISH',
}

