import { IBase } from "./IBase";

export interface IRecord extends IBase {
    lineUserId?: string;
    name?: string;
    distance?: number;
    startTime?: Date;
    endTime?: Date;
    avgSpeed?: number;
    maxSpeed?: number;
    locations?: [{ 
        longitude: number; 
        latitude: number; 
    }];
    imglocations?: number[];
    modifyAt?: Date;
}