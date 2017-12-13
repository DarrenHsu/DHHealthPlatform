import mongoose = require("mongoose");
import { IChatroom } from "../interface/IChatroom";
import { ChatroomSchema } from "../schemas/ChatroomSchema";
import { IChatroomModel } from "../models/model";
import { BaseHelper } from "./BaseHelper";
import { MONGODB_CODE } from "../../routes/ResultCode";
import { DHLog } from "../../util/DHLog";

export class ChatroomHelper implements BaseHelper {
    
    private static model: mongoose.Model<IChatroomModel>;

    constructor(connection: mongoose.Connection) {
        if (!ChatroomHelper.model)  {
            ChatroomHelper.model = connection.model<IChatroomModel>("chat", ChatroomSchema);
        }
    }

    public save(id: string, data: IChatroom);
    public save(id: string, data: IChatroom, callback: (code: MONGODB_CODE, result: IChatroom) => void);
    public save(id: string, data: IChatroom, callback?: (code: MONGODB_CODE, result: IChatroom) => void) {
        if (!data || !id) {
            DHLog.d("data error：" + data);
            if (callback) callback(MONGODB_CODE.MC_NO_DATA_ERROR, null);
            return;
        }
        
        ChatroomHelper.model.findByIdAndUpdate(id, data, (err, res) => {
            if (err) {
                DHLog.d("find by id and update error：" + err);
                if (callback) callback(MONGODB_CODE.MC_SELECT_ERROR, null);
                return;
            }

            if (res) {
                DHLog.d("update:" + res._id);
                res.type = data.type;
                res.modifyAt = new Date();
                res.save();

                if (callback) callback(MONGODB_CODE.MC_SUCCESS, res);
            }else {
                DHLog.d("not update");
                if (callback) callback(MONGODB_CODE.MC_UPDATE_NOT_FOUND_ERROR, null);
            }
        });
    }

    public add(data: IChatroom, callback: (code: MONGODB_CODE, result: IChatroom) => void) {
        if (!data) {
            DHLog.d("add data error " + data);
            if (callback) callback(MONGODB_CODE.MC_NO_DATA_ERROR, null);
            return;
        }

        ChatroomHelper.model.update({chatId: data.chatId}, data, {multi: true}, (err, raw) => {
            if (err) {
                DHLog.d("count error:" + err);
                if (callback) callback(MONGODB_CODE.MC_COUNT_ERROR, null);
                return;
            }
            
            DHLog.d("raw:" + JSON.stringify(raw));
            if (raw && (raw.n > 0 || raw.nModified > 0)) {
                DHLog.d("update exist data");
                if (callback) callback(MONGODB_CODE.MC_SUCCESS, data);
            }else {
                new ChatroomHelper.model(data).save((err, res, count) => {
                    if (err) {
                        DHLog.d("add error" + err);
                        if (callback) callback(MONGODB_CODE.MC_INSERT_ERROR, null);
                    }else {
                        DHLog.d("add data:" + res._id);
                        if (callback) callback(MONGODB_CODE.MC_SUCCESS, res);
                    }
                });
            }
        });        
    }

    public remove(id: string);
    public remove(id: string, callback: (code: MONGODB_CODE) => void);
    public remove(id: string, callback?: (code: MONGODB_CODE) => void) {
        if (!id) {
            DHLog.d("id error：" + id);
            if (callback) callback(MONGODB_CODE.MC_NO_CONDITION_ERROR);
            return;
        }

        ChatroomHelper.model.remove({_id : id}, (err) => {
            if (err) {
                DHLog.d("remove by id error：" + err);
                if (callback) callback(MONGODB_CODE.MC_DELETE_ERROR);               
            }else {
                DHLog.d("remove by id success");
                if (callback) callback(MONGODB_CODE.MC_SUCCESS);                    
            }
        });
    }

    public list(lineUserId: string);
    public list(lineUserId: string, callback: (code: MONGODB_CODE, results: IChatroom[]) => void);
    public list(lineUserId: string, callback?: (code: MONGODB_CODE, results: IChatroom[]) => void) {
        if (!lineUserId) {
            DHLog.d("id error：" + lineUserId);
            if (callback) callback(MONGODB_CODE.MC_NO_CONDITION_ERROR, null);
            return;
        }

        ChatroomHelper.model.find({lineUserId: lineUserId} , (err, ress) => {
            if (err) {
                DHLog.d("find error:" + err);
                if (callback) callback(MONGODB_CODE.MC_SELECT_ERROR, null);
            }else {
                DHLog.d("find " + ress.length);
                if (callback) callback(MONGODB_CODE.MC_SUCCESS, ress);
            }
        });
    }
}