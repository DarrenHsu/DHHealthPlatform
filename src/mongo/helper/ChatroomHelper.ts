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
        DHLog.d("save id " + id + JSON.stringify(data));

        if (!data || !id) {
            DHLog.d("data error：" + data);
            if (callback) callback(MONGODB_CODE.MC_NO_DATA, null);
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
        DHLog.d("add " + JSON.stringify(data));

        if (!data) {
            DHLog.d("add data error " + data);
            if (callback) callback(MONGODB_CODE.MC_NO_DATA, null);
            return;
        }

        data.type = "test";

        ChatroomHelper.model.update({chatId: data.chatId}, data, (err, raw) => {
            if (err) {
                DHLog.d("count error:" + err);
                if (callback) callback(MONGODB_CODE.MC_COUNT_ERROR, null);
                return;
            }

            if (raw) {
                DHLog.d("raw:" + raw.type);
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

        // ChatroomHelper.model.count({userId: data.userId, chatId: data.chatId}, (err, count) => {
        //     if (err) {
        //         DHLog.d("count error:" + err);
        //         if (callback) callback(MONGODB_CODE.MC_COUNT_ERROR, null);
        //         return;
        //     }
            
        //     if (count > 0) {
        //         DHLog.d("data exist!");
        //         if (callback) callback(MONGODB_CODE.MC_DATA_EXIST, null);
        //     }else {
        //         new ChatroomHelper.model(data).save((err, res, count) => {
        //             if (err) {
        //                 DHLog.d("add error" + err);
        //                 if (callback) callback(MONGODB_CODE.MC_INSERT_ERROR, null);
        //             }else {
        //                 DHLog.d("add data:" + res._id);
        //                 if (callback) callback(MONGODB_CODE.MC_SUCCESS, res);
        //             }
        //         });
        //     }
        // });
    }

    public remove(id: string);
    public remove(id: string, callback: (code: MONGODB_CODE) => void);
    public remove(id: string, callback?: (code: MONGODB_CODE) => void) {
        DHLog.d("remove id " + id);

        if (!id) {
            DHLog.d("id error：" + id);
            if (callback) callback(MONGODB_CODE.MC_NO_CONDITION);
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

    public list(userId: string);
    public list(userId: string, callback: (code: MONGODB_CODE, results: IChatroom[]) => void);
    public list(userId: string, callback?: (code: MONGODB_CODE, results: IChatroom[]) => void) {
        DHLog.d("list id " + userId);

        if (!userId) {
            DHLog.d("id error：" + userId);
            if (callback) callback(MONGODB_CODE.MC_NO_CONDITION, null);
            return;
        }

        ChatroomHelper.model.find( {userId: userId} , (err, ress) => {
            if (err) {
                DHLog.d("find error:" + err);
                if (callback) callback(MONGODB_CODE.MC_SELECT_ERROR, null);
            }else {
                DHLog.d("find");
                if (callback) callback(MONGODB_CODE.MC_SUCCESS, ress);                    
            }
        });
    }
}