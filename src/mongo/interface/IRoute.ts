import { IBase } from "./IBase";

export interface IRoute extends IBase {
    lineUserId?: string;
    name?: string;
    startDate?: string;
    startTime?: string;
    endTime?: string;
    ytbroadcastId?: string;
    modifyAt?: Date;
}