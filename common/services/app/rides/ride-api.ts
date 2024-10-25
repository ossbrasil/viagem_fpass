import {Address, CreateRideDto, HereRoute, Ride} from "@/core/interfaces/ride";
import {ResponseRouteObject} from "@/common/services/app/rides/dto/response-route.object";
import {FetchManyRides} from "@/common/services/app/rides/dto/fetch-many-ride.input";
import {HttpService} from "@/core/shared/http-service";

export interface IRideAPI {
    getManyRides: (searchQuery?: FetchManyRides) => Promise<Ride[]>;
    getRoute: (departureTime: number, addresses: HereRoute[]) => Promise<ResponseRouteObject | null>
    geoDecode: (address: Address) => Promise<Address | null>
    updateRide: (id: number, ride: Partial<Ride>) => Promise<boolean>
    createRide: (ride: CreateRideDto) => Promise<Response | void>
    getPlate: (plate: string) => Promise<string[]>
}

export class RideAPI implements IRideAPI{
    constructor(private readonly httpService: HttpService) {}

    async getManyRides(searchQuery: FetchManyRides = {}): Promise<Ride[]> {
        const params = new URLSearchParams(<Record<string, string>>searchQuery);
        const response = await this.httpService.get({params, subPaths: ['rides']})
        if (!response) {
            return [];
        }
        const data = await response.json();
        return data.data;
    }

    async getRoute(departureTime: number, addresses: HereRoute[]): Promise<ResponseRouteObject | null> {
        const response = await this.httpService.post({
            options: {
                body: JSON.stringify({
                    expectedDepartureTime: departureTime,
                    addresses: addresses,
                })
            },
            subPaths: ['rides', 'route'],
        });
        if (!response) return response;
        return await response.json();
    }

    async geoDecode(address: Address): Promise<Address | null> {
        const stringParams = Object.fromEntries(
            Object.entries(address).map(([key, value]) => [key, String(value)])
        );
        const params = new URLSearchParams(stringParams);
        const response = await this.httpService.get({
            params,
            subPaths: ['rides', 'geodecode'],
        });
        if (!response) {return response}
        return await response.json();
    }

    async updateRide(id: number, ride: Partial<Ride>): Promise<boolean> {
        const response = await this.httpService.patch({
            options: {
                body: JSON.stringify(ride)
            },
            subPaths: ['rides', id.toString()]
        });
        return !response ? false : response.ok;
    }

    async createRide(ride: CreateRideDto) {
        const response = await this.httpService.post({
            options: {
                body: JSON.stringify(ride)
            },
            subPaths: ['rides']
        });
        if (!response || (response && !response.ok)) {
            console.log(await response!.json())
            return [];
        }
        return await response.json();
    }

    async getPlate(plate: string): Promise<string[]> {
        const params = new URLSearchParams({plate});
        const response = await this.httpService.get({params, subPaths: ['rides', 'plate']});
        if (!response) {
            return [];
        }
        return await response.json();
    }
}