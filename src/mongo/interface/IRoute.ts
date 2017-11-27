import { IBase } from "./IBase";

export interface IRoute extends IBase {
    userId?: string;
    name?: string;
    startTime?: Date;
    endTime?: Date;
}