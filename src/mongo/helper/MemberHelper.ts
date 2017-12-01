import mongoose = require("mongoose");
import { IMember } from "../interface/IMember";
import { MemberSchema } from "../schemas/MemberSchema";
import { IMemberModel } from "../models/model";
import { BaseHelper } from "./BaseHelper";
import { MONGODB_CODE } from "../../routes/ResultCode";
import { DHLog } from "../../util/DHLog";

export class MemberHelper implements BaseHelper {
    
    private static model: mongoose.Model<IMemberModel>;

    constructor(connection: mongoose.Connection) {
        if (!MemberHelper.model)  {
            MemberHelper.model = connection.model<IMemberModel>("chat", MemberSchema);
        }
    }

    public save(id: string, data: IMember);
    public save(id: string, data: IMember, callback: (code: MONGODB_CODE, result: IMember) => void);
    public save(id: string, data: IMember, callback?: (code: MONGODB_CODE, result: IMember) => void) {
        if (!data || !id) {
            DHLog.d("data error：" + data);
            if (callback) callback(MONGODB_CODE.MC_NO_DATA, null);
            return;
        }
        
        MemberHelper.model.findByIdAndUpdate(id, data, (err, res) => {
            if (err) {
                DHLog.d("find by id and update error：" + err);
                if (callback) callback(MONGODB_CODE.MC_SELECT_ERROR, null);
                return;
            }

            if (res) {
                DHLog.d("update:" + res._id);
                res.lineUserId = data.lineUserId;
                res.displayNmae = data.displayNmae;
                res.pictureUrl = data.pictureUrl;
                res.modifyAt = new Date();
                res.save();

                if (callback) callback(MONGODB_CODE.MC_SUCCESS, res);
            }else {
                DHLog.d("not update");
                if (callback) callback(MONGODB_CODE.MC_UPDATE_NOT_FOUND_ERROR, null);
            }
        });
    }

    public add(data: IMember, callback: (code: MONGODB_CODE, result: IMember) => void) {
        if (!data) {
            DHLog.d("add data error " + data);
            if (callback) callback(MONGODB_CODE.MC_NO_DATA, null);
            return;
        }

        MemberHelper.model.count({lineUserId: data.lineUserId}, (err, count) => {
            if (err) {
                DHLog.d("count error:" + err);
                if (callback) callback(MONGODB_CODE.MC_COUNT_ERROR, null);
                return;
            }
            
            if (count > 0) {
                DHLog.d("data exist!");
                if (callback) callback(MONGODB_CODE.MC_DATA_EXIST, null);
            }else {
                new MemberHelper.model(data).save((err, res, count) => {
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
            if (callback) callback(MONGODB_CODE.MC_NO_CONDITION);
            return;
        }

        MemberHelper.model.remove({_id : id}, (err) => {
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
    public list(userId: string, callback: (code: MONGODB_CODE, results: IMember[]) => void);
    public list(userId: string, callback?: (code: MONGODB_CODE, results: IMember[]) => void) {
        if (!userId) {
            DHLog.d("id error：" + userId);
            if (callback) callback(MONGODB_CODE.MC_NO_CONDITION, null);
            return;
        }

        MemberHelper.model.find( {userId: userId} , (err, ress) => {
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