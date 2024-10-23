import {Address} from "@/core/interfaces/ride";

export const selectIcon = (idx: number, arrLength: number): any => {
    switch (true) {
        case idx === 0:
            return 'start'
        case (idx === arrLength - 1):
            return 'outlined-flag'
        case idx === 1:
            return 'looks-one'
        case idx === 2:
            return 'looks-two'
        case idx >= 3 && idx <= 6:
            return `looks-${idx}`;
        default:
            return 'outlined-flag'
    }
}
export const parseAddressStr = (address: Address) => `${address.street} ${address.number}${address.complement ? ' ' + address.complement + ', ' : ', '}${address.city}`;
