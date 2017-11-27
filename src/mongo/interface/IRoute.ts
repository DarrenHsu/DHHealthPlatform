import { IBase } from "./IBase";

export interface IRoute extends IBase {
    userId?: string;
    gmail?: string;
    name?: string;
    startTime?: Date;
    endTime?: Date;
}