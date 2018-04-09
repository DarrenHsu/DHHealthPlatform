import { IBase } from "./IBase";

export interface IAuth extends IBase {
    lineUserId: string;
    googleToken?: string;
    googleTokenExpire?: Date;
    lineToken?: string;
    lineTokenExpire?: Date;
}