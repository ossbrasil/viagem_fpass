import {CreateRideDto} from "@/core/interfaces/ride";

export interface ResponseRouteObject extends Omit<CreateRideDto, 'driverId' | 'carPlate1' | 'carPlate2' | 'towPlate'> {}