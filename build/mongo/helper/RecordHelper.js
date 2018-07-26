"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ConcreteHelper_1 = require("./ConcreteHelper");
const RecordSchema_1 = require("../schemas/RecordSchema");
const ResultCode_1 = require("../../routes/ResultCode");
const DHLog_1 = require("../../util/DHLog");
/**
 * @description 紀錄資料存取控制
 */
class RecordHelper extends ConcreteHelper_1.ConcreteHelper {
    constructor(connection) {
        super(connection);
        if (!RecordHelper.model) {
            RecordHelper.model = connection.model('record', RecordSchema_1.RecordSchema);
        }
    }
    save(id, data, callback) {
        if (!data || !id) {
            DHLog_1.DHLog.d('data error：' + data);
            if (callback)
                callback(ResultCode_1.MONGODB_CODE.MC_NO_DATA_ERROR, null);
            return;
        }
        RecordHelper.model.findByIdAndUpdate(id, data, (err, res) => {
            if (err) {
                DHLog_1.DHLog.d('find by id and update error：' + err);
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_SELECT_ERROR, null);
                return;
            }
            if (res) {
                DHLog_1.DHLog.d('update:' + res._id);
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
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_SUCCESS, res);
            }
            else {
                DHLog_1.DHLog.d('not update');
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_UPDATE_NOT_FOUND_ERROR, null);
            }
        });
    }
    add(data, callback) {
        if (!data) {
            DHLog_1.DHLog.d('add data error ' + data);
            if (callback)
                callback(ResultCode_1.MONGODB_CODE.MC_NO_DATA_ERROR, null);
            return;
        }
        RecordHelper.model.update({ lineUserId: data.lineUserId, recordId: data.recordId }, data, { multi: true }, (err, raw) => {
            if (err) {
                DHLog_1.DHLog.d('count error:' + err);
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_COUNT_ERROR, null);
                return;
            }
            DHLog_1.DHLog.d('raw:' + JSON.stringify(raw));
            if (raw && (raw.n > 0 || raw.nModified > 0)) {
                DHLog_1.DHLog.d('update exist data');
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_SUCCESS, data);
            }
            else {
                new RecordHelper.model(data).save((err, res, count) => {
                    if (err) {
                        DHLog_1.DHLog.d('add error' + err);
                        if (callback)
                            callback(ResultCode_1.MONGODB_CODE.MC_INSERT_ERROR, null);
                    }
                    else {
                        DHLog_1.DHLog.d('add data:' + JSON.stringify(res));
                        if (callback)
                            callback(ResultCode_1.MONGODB_CODE.MC_SUCCESS, res);
                    }
                });
            }
        });
    }
    remove(id, callback) {
        if (!id) {
            DHLog_1.DHLog.d('id error：' + id);
            if (callback)
                callback(ResultCode_1.MONGODB_CODE.MC_NO_CONDITION_ERROR);
            return;
        }
        this.modelRemove(RecordHelper.model, { _id: id }, callback);
    }
    findOne(recordId, callback) {
        if (!recordId) {
            DHLog_1.DHLog.d('recordId error：' + recordId);
            if (callback)
                callback(ResultCode_1.MONGODB_CODE.MC_NO_CONDITION_ERROR, null);
            return;
        }
        this.modelFindOne(RecordHelper.model, { recordId: recordId }, callback);
    }
    find(lineUserId, callback) {
        if (!lineUserId) {
            DHLog_1.DHLog.d('id error：' + lineUserId);
            if (callback)
                callback(ResultCode_1.MONGODB_CODE.MC_NO_CONDITION_ERROR, null);
            return;
        }
        this.modelFind(RecordHelper.model, { lineUserId: lineUserId }, { startTime: -1 }, callback);
    }
    findWith(conditions, sort, callback) {
        if (!conditions) {
            DHLog_1.DHLog.d('condition is null');
            if (callback)
                callback(ResultCode_1.MONGODB_CODE.MC_NO_CONDITION_ERROR, null);
            return;
        }
        this.modelFind(RecordHelper.model, conditions, sort, callback);
    }
}
exports.RecordHelper = RecordHelper;
