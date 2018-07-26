import * as mongoose        from 'mongoose';

import { ConcreteHelper }   from './ConcreteHelper';

import { IRecord }          from '../interface/IRecord';
import { RecordSchema }     from '../schemas/RecordSchema';
import { IRecordModel }     from '../models/model';

import { MONGODB_CODE }     from '../../routes/ResultCode';
import { DHLog }            from '../../util/DHLog';

/**
 * @description 紀錄資料存取控制
 */
export class RecordHelper extends ConcreteHelper {
    
    private static model: mongoose.Model<IRecordModel>;

    constructor(connection: mongoose.Connection) {
        super(connection);

        if (!RecordHelper.model)  {
            RecordHelper.model = connection.model<IRecordModel>('record', RecordSchema);
        }
    }

    public save(id: string, data: IRecord, callback?: (code: MONGODB_CODE, result: IRecordModel) => void) {
        if (!data || !id) {
            DHLog.d('data error：' + data);
            if (callback) callback(MONGODB_CODE.MC_NO_DATA_ERROR, null);
            return;
        }
        
        RecordHelper.model.findByIdAndUpdate(id, data, (err, res) => {
            if (err) {
                DHLog.d('find by id and update error：' + err);
                if (callback) callback(MONGODB_CODE.MC_SELECT_ERROR, null);
                return;
            }

            if (res) {
                DHLog.d('update:' + res._id);
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
                res.step = data.step;
                res.locations = data.locations;
                res.imglocations = data.imglocations;
                res.modifyAt = new Date();
                res.save();

                if (callback) callback(MONGODB_CODE.MC_SUCCESS, res);
            }else {
                DHLog.d('not update');
                if (callback) callback(MONGODB_CODE.MC_UPDATE_NOT_FOUND_ERROR, null);
            }
        });
    }

    public add(data: IRecord, callback: (code: MONGODB_CODE, result: IRecord) => void) {
        if (!data) {
            DHLog.d('add data error ' + data);
            if (callback) callback(MONGODB_CODE.MC_NO_DATA_ERROR, null);
            return;
        }

        RecordHelper.model.update({lineUserId: data.lineUserId, recordId: data.recordId}, data, {multi: true}, (err, raw) => {
            if (err) {
                DHLog.d('count error:' + err);
                if (callback) callback(MONGODB_CODE.MC_COUNT_ERROR, null);
                return;
            }
            
            DHLog.d('raw:' + JSON.stringify(raw));
            if (raw && (raw.n > 0 || raw.nModified > 0)) {
                DHLog.d('update exist data');
                if (callback) callback(MONGODB_CODE.MC_SUCCESS, data);
            }else {
                new RecordHelper.model(data).save((err, res, count) => {
                    if (err) {
                        DHLog.d('add error' + err);
                        if (callback) callback(MONGODB_CODE.MC_INSERT_ERROR, null);
                    }else {
                        DHLog.d('add data:' + JSON.stringify(res));
                        if (callback) callback(MONGODB_CODE.MC_SUCCESS, res);
                    }
                });
            }
        });
    }

    public remove(id: string, callback?: (code: MONGODB_CODE) => void) {
        if (!id) {
            DHLog.d('id error：' + id);
            if (callback) callback(MONGODB_CODE.MC_NO_CONDITION_ERROR);
            return;
        }

        this.modelRemove(RecordHelper.model, {_id: id}, callback);
    }

    public removeWith(conditions: Object, callback?: (code: MONGODB_CODE) => void) {
        if (!conditions) {
            DHLog.d('conditions error');
            if (callback) callback(MONGODB_CODE.MC_NO_CONDITION_ERROR);
            return;
        }

        this.modelRemove(RecordHelper.model, conditions, callback);
    }

    public findOne(recordId: string, callback?: (code: MONGODB_CODE, results: IRecord) => void) {
        if (!recordId) {
            DHLog.d('recordId error：' + recordId);
            if (callback) callback(MONGODB_CODE.MC_NO_CONDITION_ERROR, null);
            return;
        }

        this.modelFindOne(RecordHelper.model, {recordId: recordId}, callback);
    }
    
    public find(lineUserId: string, callback?: (code: MONGODB_CODE, results: IRecordModel[]) => void) {
        if (!lineUserId) {
            DHLog.d('id error：' + lineUserId);
            if (callback) callback(MONGODB_CODE.MC_NO_CONDITION_ERROR, null);
            return;
        }

        this.modelFind(RecordHelper.model, {lineUserId: lineUserId}, {startTime: -1}, callback);
    }

    public findWith(conditions: Object, sort: Object, callback?: (code: MONGODB_CODE, results: IRecordModel[]) => void) {
        if (!conditions) {
            DHLog.d('condition is null');
            if (callback) callback(MONGODB_CODE.MC_NO_CONDITION_ERROR, null);
            return;
        }

        this.modelFind(RecordHelper.model, conditions, sort, callback);
    }
}