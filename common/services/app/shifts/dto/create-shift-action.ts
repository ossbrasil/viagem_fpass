export interface CreateShiftAction {
    shiftId: number;
    actionType: string;
    value: number;
    description: string;
    documentURI?:string;
}