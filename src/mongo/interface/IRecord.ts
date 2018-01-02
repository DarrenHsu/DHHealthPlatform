import { IBase } from "./IBase";

export interface IRecord extends IBase {
    lineUserId?: string;
    recordId?: string;
    name?: string;
    locality?: string;
    distance?: number;
    startTime?: Date;
    endTime?: Date;
    avgSpeed?: number;
    maxSpeed?: number;
    altitude?: number;
    locations?: [[number, number]];
    imglocations?: number[];
    modifyAt?: Date;
}