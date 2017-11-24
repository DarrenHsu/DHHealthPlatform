import mongoose = require("mongoose");
import { IRecord } from "../interface/IRecord";
import { RecordSchema } from "../schemas/RecordSchema";
import { IRecordModel, IRoute } from "../models/model";
import { BaseHelper } from "./BaseHelper";
import { MONGODB_CODE } from "../../routes/ResultCode";

export class RecordHelper extends BaseHelper {
    
    private static model: mongoose.Model<IRecordModel>;

    constructor(connection: mongoose.Connection) {
        super();

        if (!RecordHelper.model)  {
            RecordHelper.model = connection.model<IRecordModel>("record", RecordSchema);
        }
    }

    public save(id: string, data: IRecord);
    public save(id: string, data: IRecord, callback: (code: MONGODB_CODE, result: IRecord) => void)
    public save(id: string, data: IRecord, callback?: (code: MONGODB_CODE, result: IRecord) => void) {
        if (!data || !id) {
            console.log("data error：" + data);
            if (callback) callback(MONGODB_CODE.MC_NO_DATA, null);
            return;
        }
        
        RecordHelper.model.findByIdAndUpdate(id, data, (err, res) => {
            if (err) {
                console.log("find by id and update error：" + err);
                if (callback) callback(MONGODB_CODE.MC_SELECT_ERROR, null);
                return;
            }

            if (res) {
                console.log("update:" + res._id);
                if (callback) callback(MONGODB_CODE.MC_SUCCESS, res);
            }else {
                console.log("not update");
                if (callback) callback(MONGODB_CODE.MC_UPDATE_NOT_FOUND_ERROR, null);
            }
        });
    }

    public add(data: IRecord, callback: (code: MONGODB_CODE, result: IRecord) => void) {
        if (!data) {
            console.log("add data error " + data);
            if (callback) callback(MONGODB_CODE.MC_NO_DATA, null);
            return;
        }
        
        new RecordHelper.model(data).save((err, res, count) => {
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

        RecordHelper.model.remove({_id : id}, (err) => {
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
    public list(userId: string, callback: (code: MONGODB_CODE, results: IRecord[]) => void);
    public list(userId: string, callback?: (code: MONGODB_CODE, results: IRecord[]) => void) {
        if (!userId) {
            console.log("id error：" + userId);
            if (callback) callback(MONGODB_CODE.MC_NO_CONDITION, null);
            return;
        }

        RecordHelper.model.find( {userId: userId} , (err, ress) => {
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