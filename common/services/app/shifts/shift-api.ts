import {Shift} from "./dto/shift.object";
import {HttpService} from "@/core/shared/http-service";
import {FetchManyShifts} from "@/common/services/app/shifts/dto/fetch-many-shift.input";
import {CreateShift} from "@/common/services/app/shifts/dto/create-shift.input";

export interface IShiftApi {
    getActiveShift: (searchQuery: FetchManyShifts) => Promise<Shift | null>;
    createShift: (createShift: CreateShift) => Promise<Shift>;
}

export class ShiftApi implements IShiftApi {
    constructor(private readonly httpService: HttpService) {}

    async getActiveShift(searchQuery: FetchManyShifts): Promise<Shift | null> {
        searchQuery.limit = 1;
        const params = new URLSearchParams(<Record<string, string>>searchQuery);
        const response = await this.httpService.get({params, subPaths: ['shifts']})
        if (!response) return null
        const data = await response.json();
        return data.data[0];
    }

    async createShift(createShift: CreateShift): Promise<Shift> {
        const response = await this.httpService.post({
            options: {
                body: JSON.stringify(createShift),
            },
            subPaths: ['shifts']
        });
        return response.json()
    }
}