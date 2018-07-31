import { IBase } from "./IBase";

export interface IProfile extends IBase {
    lineUserId: string;
    displayName?: string;
    pictureUrl?: string;
}