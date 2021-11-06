import { BOAT_TYPE } from '../constants';

export const getBoatType = (type: string): string => {
    if (BOAT_TYPE.includes(type)) {
        return type;
    }
    return "Other";
}