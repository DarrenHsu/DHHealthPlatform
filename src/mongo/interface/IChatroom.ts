import { IBase } from "./IBase";

export interface IChatroom extends IBase {
    lineUserId?: string;
    type?: string;
    chatId?: string;
    modifyAt?: Date;
}