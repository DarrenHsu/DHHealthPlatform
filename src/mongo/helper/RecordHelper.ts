import mongoose = require("mongoose");
import { IRecord } from "../interface/IRecord";
import { RecordSchema } from "../schemas/RecordSchema";
import { IRecordModel } from "../models/model";
import { BaseHelper } from "./BaseHelper";
import { MONGODB_CODE } from "../../routes/ResultCode";
import { DHLog } from "../../util/DHLog";

export class RecordHelper implements BaseHelper {
    
    private static model: mongoose.Model<IRecordModel>;

    constructor(connection: mongoose.Connection) {
        if (!RecordHelper.model)  {
            RecordHelper.model = connection.model<IRecordModel>("record", RecordSchema);
        }
    }

    public save(id: string, data: IRecord);
    public save(id: string, data: IRecord, callback: (code: MONGODB_CODE, result: IRecord) => void);
    public save(id: string, data: IRecord, callback?: (code: MONGODB_CODE, result: IRecord) => void) {
        DHLog.d("save id " + id + JSON.stringify(data));

        if (!data || !id) {
            DHLog.d("data error：" + data);
            if (callback) callback(MONGODB_CODE.MC_NO_DATA, null);
            return;
        }
        
        RecordHelper.model.findByIdAndUpdate(id, data, (err, res) => {
            if (err) {
                DHLog.d("find by id and update error：" + err);
                if (callback) callback(MONGODB_CODE.MC_SELECT_ERROR, null);
                return;
            }

            if (res) {
                DHLog.d("update:" + res._id);
                res.name = data.name;
                res.distance = data.distance;
                res.startTime = data.startTime;
                res.endTime = data.endTime;
                res.avgSpeed = data.avgSpeed;
                res.maxSpeed = data.maxSpeed;
                res.locations = data.locations;
                res.imglocations = data.imglocations;
                res.modifyAt = new Date();
                res.save();

                if (callback) callback(MONGODB_CODE.MC_SUCCESS, res);
            }else {
                DHLog.d("not update");
                if (callback) callback(MONGODB_CODE.MC_UPDATE_NOT_FOUND_ERROR, null);
            }
        });
    }

    public add(data: IRecord, callback: (code: MONGODB_CODE, result: IRecord) => void) {
        DHLog.d("add id " + JSON.stringify(data));

        if (!data) {
            DHLog.d("add data error " + data);
            if (callback) callback(MONGODB_CODE.MC_NO_DATA, null);
            return;
        }
        
        new RecordHelper.model(data).save((err, res, count) => {
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
        DHLog.d("remove id " + id);

        if (!id) {
            DHLog.d("id error：" + id);
            if (callback) callback(MONGODB_CODE.MC_NO_CONDITION);
            return;
        }

        RecordHelper.model.remove({_id : id}, (err) => {
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
    public list(userId: string, callback: (code: MONGODB_CODE, results: IRecord[]) => void);
    public list(userId: string, callback?: (code: MONGODB_CODE, results: IRecord[]) => void) {
        DHLog.d("list id " + userId);

        if (!userId) {
            DHLog.d("id error：" + userId);
            if (callback) callback(MONGODB_CODE.MC_NO_CONDITION, null);
            return;
        }

        RecordHelper.model.find( {userId: userId} , (err, ress) => {
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