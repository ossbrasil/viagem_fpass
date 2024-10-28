import {Ride} from "@/core/interfaces/ride";

export interface Shift {
    id: number;
    openingCash: number;
    closingCash: number|null;
    startTime: number;
    endTime: number|null;
    employeeId: number;
    supervisorId: number|null;
    ride: Ride;
}
