import mongoose = require("mongoose");
import { IRoute } from "../interface/IRoute";
import { RouteSchema } from "../schemas/RouteSchema";
import { IUserModel, IRouteModel, IRecordModel } from "../models/model";
import { BaseHelper } from "./BaseHelper";
import { MONGODB_CODE } from "../../routes/ResultCode";

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
            console.log("id error：" + id);
            if (callback) callback(MONGODB_CODE.MC_NO_CONDITION, null);
            return;
        }
        
        RouteHelper.model.findByIdAndUpdate(id, data, (err, res) => {
            if (err) {
                console.log("find by id and update error：" + err);
                if (callback) callback(MONGODB_CODE.MC_SELECT_ERROR, null);
                return;
            }

            if (res) {
                console.log("find");
                res.name = data.name;
                res.startTime = data.startTime;
                res.endTime = data.endTime;
                res.save();

                if (callback) callback(MONGODB_CODE.MC_SUCCESS, res);
            }else {
                console.log("not find");
                if (callback) callback(MONGODB_CODE.MC_UPDATE_NOT_FOUND_ERROR, null);
            }
        });
    }

    public add(data: IRoute, callback: (code: MONGODB_CODE, result: IRoute) => void) {
        if (!data) {
            console.log("add data error " + data);
            if (callback) callback(MONGODB_CODE.MC_NO_DATA, null);
            return;
        }
        
        new RouteHelper.model(data).save((err, res, count) => {
            if (err) {
                console.log("add error" + err);
                if (callback) callback(MONGODB_CODE.MC_INSERT_ERROR, null);
            }else {
                console.log("add data:" + res._id);
                if (callback) callback(MONGODB_CODE.MC_SUCCESS, res);
            }
        });
    }

    public remove(id: string);
    public remove(id: string, callback: (code: MONGODB_CODE) => void);
    public remove(id: string, callback?: (code: MONGODB_CODE) => void) {
        if (!id) {
            console.log("id error：" + id);
            if (callback) callback(MONGODB_CODE.MC_NO_CONDITION);
            return;
        }

        RouteHelper.model.remove({_id : id}, (err) => {
            if (err) {
                console.log("remove by id error：" + err);
                if (callback) callback(MONGODB_CODE.MC_DELETE_ERROR);               
            }else {
                console.log("remove by id success");
                if (callback) callback(MONGODB_CODE.MC_SUCCESS);                    
            }
        });
    }

    public list(userId: string);
    public list(userId: string, callback: (code: MONGODB_CODE, results: IRoute[]) => void);
    public list(userId: string, callback?: (code: MONGODB_CODE, results: IRoute[]) => void) {
        if (!userId) {
            console.log("id error：" + userId);
            if (callback) callback(MONGODB_CODE.MC_NO_CONDITION, null);
            return;
        }

        RouteHelper.model.find( {userId: userId} , (err, ress) => {
            if (err) {
                console.log("find error:" + err);
                if (callback) callback(MONGODB_CODE.MC_SELECT_ERROR, null);
            }else {
                console.log("find");
                if (callback) callback(MONGODB_CODE.MC_SUCCESS, ress);                    
            }
        });
    }

}