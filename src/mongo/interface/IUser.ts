import { IBase } from "./IBase";

export interface IUser extends IBase {
    name?: string;
    height?: number;
    weight?: number;
    age?: number;
    gmail?: string;
    lineUserId?: string;
    pictureUrl?: string;
    modifyAt?: Date;
}