import { IBase } from "./IBase";

export interface IRecord extends IBase {
    lineUserId?: string;
    name?: string;
    distance?: number;
    startDate?: string;
    startTime?: string;
    endTime?: string;
    avgSpeed?: number;
    maxSpeed?: number;
    locations?: [[number, number]];
    imglocations?: number[];
    modifyAt?: Date;
}