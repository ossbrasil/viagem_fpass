import {HttpService} from "@/core/shared/http-service";
import {FetchManyVehicles} from "@/common/services/app/vehicles/dto/fetch-many-vehicles.input";
import {ResponseVehicleObject} from "@/common/services/app/vehicles/dto/response-route.object";

export interface IVehicleAPI {
    fetchManyVehicles: (searchQuery?: FetchManyVehicles) => Promise<ResponseVehicleObject[]>;

}

export class VehicleAPI implements IVehicleAPI {
    constructor(private readonly httpService: HttpService) {}

    async fetchManyVehicles(searchQuery: FetchManyVehicles = {}): Promise<ResponseVehicleObject[]> {
        const params = new URLSearchParams(<Record<string, string>>searchQuery);
        const response = await this.httpService.get({params, subPaths: ['vehicles']});
        if (!response) {
            return [];
        }
        const data = await response.json();
        return data.data;
    }
}