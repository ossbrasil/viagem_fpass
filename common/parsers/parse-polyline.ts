import {LatLng} from "react-native-maps";

const DECODING_TABLE = [
    62, -1, -1, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1,
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, -1, -1, -1, -1, 63, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
    36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51
];

const FORMAT_VERSION = 1;


export function parsePolyline(encoded: string) {
    const decoder = decodeUnsignedValues(encoded);
    const header = decodeHeader(decoder[0], decoder[1]);

    const factorDegree = 10 ** header.precision;

    let lastLat = 0;
    let lastLng = 0;
    const res: LatLng[] = [];

    let i = 2;
    while (i < decoder.length) {
        const deltaLat = toSigned(decoder[i]);
        const deltaLng = toSigned(decoder[i + 1]);
        lastLat += deltaLat;
        lastLng += deltaLng;


        res.push({latitude: lastLat / factorDegree, longitude: lastLng / factorDegree});
        i += 2;

    }

    if (i !== decoder.length) {
        throw new Error('Invalid encoding. Premature ending reached');
    }

    return {
        ...header,
        polyline: res,
    };

    function decodeChar(char: string) {
        const charCode = char.charCodeAt(0);
        return DECODING_TABLE[charCode - 45];
    }

    function decodeUnsignedValues(encoded: string) {
        let result = 0;
        let shift = 0;
        const resList: number[] = [];

        encoded.split('').forEach((char) => {
            const value = decodeChar(char);
            result |= (value & 0x1F) << shift;
            if ((value & 0x20) === 0) {
                resList.push(result);
                result = 0;
                shift = 0;
            } else {
                shift += 5;
            }
        });

        if (shift > 0) {
            throw new Error('Invalid encoding');
        }

        return resList;
    }

    function decodeHeader(version: number, encodedHeader: number) {
        if (+version.toString() !== FORMAT_VERSION) {
            throw new Error('Invalid format version');
        }
        const headerNumber = +encodedHeader.toString();
        const precision = headerNumber & 15;
        const thirdDim = (headerNumber >> 4) & 7;
        const thirdDimPrecision = (headerNumber >> 7) & 15;
        return {precision, thirdDim, thirdDimPrecision};
    }

    function toSigned(val: number) {
        // Decode the sign from an unsigned value
        let res = val;
        if (res & 1) {
            res = ~res;
        }
        res >>= 1;
        return +res.toString();
    }
}
