import { IBase } from "./IBase";

export interface IMember extends IBase {
    userId?: string;
    displayNmae?: string;
    lineUserId?: string;
    pictureUrl?: string;
    modifyAt?: Date;
}