import mongoose = require("mongoose");
import { IRoute } from "../interface/IRoute";
import { RouteSchema } from "../schemas/RouteSchema";
import { IUserModel, IRouteModel, IRecordModel } from "../models/model";
import { BaseHelper } from "./BaseHelper";
import { MONGODB_CODE } from "../../routes/ResultCode";
import { DHLog } from "../../util/DHLog";

export class RouteHelper implements BaseHelper {
    
    private static model: mongoose.Model<IRouteModel>;

    constructor(connection: mongoose.Connection) {
        if (!RouteHelper.model)  {
            RouteHelper.model = connection.model<IRouteModel>("route", RouteSchema);
        }
    }

    public save(id: string, data: IRoute);
    public save(id: string, data: IRoute, callback: (code: MONGODB_CODE, result: IRoute) => void);
    public save(id: string, data: IRoute, callback?: (code: MONGODB_CODE, result: IRoute) => void) {
        if (!id) {
            DHLog.d("id error：" + id);
            if (callback) callback(MONGODB_CODE.MC_NO_CONDITION, null);
            return;
        }
        
        RouteHelper.model.findByIdAndUpdate(id, data, (err, res) => {
            if (err) {
                DHLog.d("find by id and update error：" + err);
                if (callback) callback(MONGODB_CODE.MC_SELECT_ERROR, null);
                return;
            }

            if (res) {
                DHLog.d("find");
                res.name = data.name;
                res.startTime = data.startTime;
                res.endTime = data.endTime;
                res.modifyAt = new Date();
                res.save();

                if (callback) callback(MONGODB_CODE.MC_SUCCESS, res);
            }else {
                DHLog.d("not find");
                if (callback) callback(MONGODB_CODE.MC_UPDATE_NOT_FOUND_ERROR, null);
            }
        });
    }

    public add(data: IRoute, callback: (code: MONGODB_CODE, result: IRoute) => void) {
        if (!data) {
            DHLog.d("add data error " + data);
            if (callback) callback(MONGODB_CODE.MC_NO_DATA, null);
            return;
        }
        
        new RouteHelper.model(data).save((err, res, count) => {
            if (err) {
                DHLog.d("add error" + err);
                if (callback) callback(MONGODB_CODE.MC_INSERT_ERROR, null);
            }else {
                DHLog.d("add data:" + res._id);
                if (callback) callback(MONGODB_CODE.MC_SUCCESS, res);
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

        RouteHelper.model.remove({_id : id}, (err) => {
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
    public list(userId: string, callback: (code: MONGODB_CODE, results: IRoute[]) => void);
    public list(userId: string, callback?: (code: MONGODB_CODE, results: IRoute[]) => void) {
        if (!userId) {
            DHLog.d("id error：" + userId);
            if (callback) callback(MONGODB_CODE.MC_NO_CONDITION, null);
            return;
        }

        RouteHelper.model.find( {userId: userId} , (err, ress) => {
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