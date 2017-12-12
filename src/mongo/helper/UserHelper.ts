import mongoose = require("mongoose");
import { IUser } from "../interface/IUser";
import { UserSchema } from "../schemas/UserSchema";
import { IUserModel } from "../models/model";
import { BaseHelper } from "./BaseHelper";
import { MONGODB_CODE } from "../../routes/ResultCode";
import { DHLog } from "../../util/DHLog";

export class UserHelper implements BaseHelper {
    
    private static model: mongoose.Model<IUserModel>;
    
    constructor(connection: mongoose.Connection) {
        if (!UserHelper.model)  {
            UserHelper.model = connection.model<IUserModel>("user", UserSchema);
        }
    }

    public save(id: string, data: IUser);
    public save(id: string, data: IUser, callback: (code: MONGODB_CODE, result: IUser) => void);
    public save(id: string, data: IUser, callback?: (code: MONGODB_CODE, result: IUser) => void) {
        if (!id) {
            DHLog.d("id error：" + id);
            if (callback) callback(MONGODB_CODE.MC_NO_CONDITION, null);
            return;
        }
        
        UserHelper.model.findByIdAndUpdate(id, data, (err, res) => {
            if (err) {
                DHLog.d("find by id and update error：" + err);
                if (callback) callback(MONGODB_CODE.MC_SELECT_ERROR, null);
                return;
            }

            if (res) {
                DHLog.d("find");
                res.name = data.name;
                res.age = data.age;
                res.height = data.height;
                res.weight = data.weight;
                res.gmail = data.gmail;
                res.lineUserId = data.lineUserId;
                res.pictureUrl = data.pictureUrl;
                res.gAccessToken = data.gAccessToken;
                res.modifyAt = new Date();
                res.save();
                
                if (callback) callback(MONGODB_CODE.MC_SUCCESS, res);
            }else {
                DHLog.d("not find");
                if (callback) callback(MONGODB_CODE.MC_UPDATE_NOT_FOUND_ERROR, null);
            }
        });
    }
    
    public add(data: IUser, callback: (code: MONGODB_CODE, result: IUser) => void) {
        if (!data || !data.lineUserId) {
            DHLog.d("add data error " + data);
            if (callback) callback(MONGODB_CODE.MC_NO_DATA, null);
            return;
        }

        UserHelper.model.count({lineUserId: data.lineUserId}, (err, count) => {
            if (err) {
                DHLog.d("count error:" + err);
                if (callback) callback(MONGODB_CODE.MC_COUNT_ERROR, null);
                return;
            }
            
            if (count > 0) {
                DHLog.d("data exist!");
                if (callback) callback(MONGODB_CODE.MC_DATA_EXIST, null);
            }else {
                new UserHelper.model(data).save((err, res, count) => {
                    if (err) {
                        DHLog.d("add error:" + err);
                        if (callback) callback(MONGODB_CODE.MC_INSERT_ERROR, null);
                    }else {
                        DHLog.d("add data:" + res.lineUserId);
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

        UserHelper.model.remove( { _id: id} , (err) => {
            if (err) {
                DHLog.d("remove by id error：" + err);
                if (callback) callback(MONGODB_CODE.MC_DELETE_NOT_FOUND_ERROR);                    
            }else {
                DHLog.d("remove by id success");
                if (callback) callback(MONGODB_CODE.MC_SUCCESS);                    
            }
        });
    }

    public list(id: string);
    public list(id: string, callback: (code: MONGODB_CODE, results: IUser[]) => void);
    public list(id: string, callback?: (code: MONGODB_CODE, results: IUser[]) => void) {
        if (!id) {
            DHLog.d("id error：" + id);
            if (callback) callback(MONGODB_CODE.MC_NO_CONDITION, null);
            return;
        }

        UserHelper.model.find( { _id: id}, (err, ress) => {
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