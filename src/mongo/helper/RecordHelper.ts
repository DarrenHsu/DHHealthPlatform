import * as mongoose from "mongoose";
import { IRecord } from "../interface/IRecord";
import { RecordSchema } from "../schemas/RecordSchema";
import { IRecordModel } from "../models/model";
import { BaseHelper } from "./BaseHelper";
import { MONGODB_CODE } from "../../routes/ResultCode";
import { DHLog } from "../../util/DHLog";
import { listenerCount } from "cluster";

export class RecordHelper implements BaseHelper {
    
    private static model: mongoose.Model<IRecordModel>;

    constructor(connection: mongoose.Connection) {
        if (!RecordHelper.model)  {
            RecordHelper.model = connection.model<IRecordModel>("record", RecordSchema);
        }
    }

    public save(id: string, data: IRecord, callback?: (code: MONGODB_CODE, result: IRecordModel) => void) {
        if (!data || !id) {
            DHLog.d("data error：" + data);
            if (callback) callback(MONGODB_CODE.MC_NO_DATA_ERROR, null);
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
                res.recordId = data.recordId;
                res.locality = data.locality;
                res.lineUserId = data.lineUserId;
                res.distance = data.distance;
                res.startTime = data.startTime;
                res.endTime = data.endTime;
                res.avgSpeed = data.avgSpeed;
                res.maxSpeed = data.maxSpeed;
                res.altitude = data.altitude;
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
        if (!data) {
            DHLog.d("add data error " + data);
            if (callback) callback(MONGODB_CODE.MC_NO_DATA_ERROR, null);
            return;
        }

        RecordHelper.model.update({lineUserId: data.lineUserId, recordId: data.recordId}, data, {multi: true}, (err, raw) => {
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
                new RecordHelper.model(data).save((err, res, count) => {
                    if (err) {
                        DHLog.d("add error" + err);
                        if (callback) callback(MONGODB_CODE.MC_INSERT_ERROR, null);
                    }else {
                        DHLog.d("add data:" + JSON.stringify(res));
                        if (callback) callback(MONGODB_CODE.MC_SUCCESS, res);
                    }
                });
            }
        });
    }

    public remove(id: string, callback?: (code: MONGODB_CODE) => void) {
        if (!id) {
            DHLog.d("id error：" + id);
            if (callback) callback(MONGODB_CODE.MC_NO_CONDITION_ERROR);
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

    public findOne(recordId: string, callback?: (code: MONGODB_CODE, results: IRecord) => void) {
        if (!recordId) {
            DHLog.d("recordId error：" + recordId);
            if (callback) callback(MONGODB_CODE.MC_NO_CONDITION_ERROR, null);
            return;
        }

        RecordHelper.model.findOne({recordId: recordId} , (err, res) => {
            if (err) {
                DHLog.d("find error:" + err);
                if (callback) callback(MONGODB_CODE.MC_SELECT_ERROR, null);
            }else {
                DHLog.d("find " + res);
                if (callback) callback(MONGODB_CODE.MC_SUCCESS, res);
            }
        });
    }
    
    public find(lineUserId: string, callback?: (code: MONGODB_CODE, results: IRecordModel[]) => void) {
        if (!lineUserId) {
            DHLog.d("id error：" + lineUserId);
            if (callback) callback(MONGODB_CODE.MC_NO_CONDITION_ERROR, null);
            return;
        }

        RecordHelper.model.find({lineUserId: lineUserId} , (err, ress) => {
            if (err) {
                DHLog.d("find error:" + err);
                if (callback) callback(MONGODB_CODE.MC_SELECT_ERROR, null);
            }else {
                DHLog.d("find " + ress.length);
                if (callback) callback(MONGODB_CODE.MC_SUCCESS, ress);
            }
        }).sort({ startTime : -1 });
    }
}