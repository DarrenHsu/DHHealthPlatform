import { IBase } from "./IBase";

export interface IChatroom extends IBase {
    userId?: string;
    type?: string;
    chatId?: string;
    members?: [{
        lineUserId: string;
    }],
    modifyAt?: Date;
}