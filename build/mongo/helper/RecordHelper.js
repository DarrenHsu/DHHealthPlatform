"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RecordSchema_1 = require("../schemas/RecordSchema");
const ResultCode_1 = require("../../routes/ResultCode");
const DHLog_1 = require("../../util/DHLog");
class RecordHelper {
    constructor(connection) {
        if (!RecordHelper.model) {
            RecordHelper.model = connection.model("record", RecordSchema_1.RecordSchema);
        }
    }
    save(id, data, callback) {
        if (!data || !id) {
            DHLog_1.DHLog.d("data error：" + data);
            if (callback)
                callback(ResultCode_1.MONGODB_CODE.MC_NO_DATA, null);
            return;
        }
        RecordHelper.model.findByIdAndUpdate(id, data, (err, res) => {
            if (err) {
                DHLog_1.DHLog.d("find by id and update error：" + err);
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_SELECT_ERROR, null);
                return;
            }
            if (res) {
                DHLog_1.DHLog.d("update:" + res._id);
                res.name = data.name;
                res.distance = data.distance;
                res.startTime = data.startTime;
                res.endTime = data.endTime;
                res.avgSpeed = data.avgSpeed;
                res.maxSpeed = data.maxSpeed;
                res.locations = data.locations;
                res.imglocations = data.imglocations;
                res.save();
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_SUCCESS, res);
            }
            else {
                DHLog_1.DHLog.d("not update");
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_UPDATE_NOT_FOUND_ERROR, null);
            }
        });
    }
    add(data, callback) {
        if (!data) {
            DHLog_1.DHLog.d("add data error " + data);
            if (callback)
                callback(ResultCode_1.MONGODB_CODE.MC_NO_DATA, null);
            return;
        }
        new RecordHelper.model(data).save((err, res, count) => {
            if (err) {
                DHLog_1.DHLog.d("add error" + err);
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_INSERT_ERROR, null);
            }
            else {
                DHLog_1.DHLog.d("add data:" + res._id);
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_SUCCESS, res);
            }
        });
    }
    remove(id, callback) {
        if (!id) {
            DHLog_1.DHLog.d("id error：" + id);
            if (callback)
                callback(ResultCode_1.MONGODB_CODE.MC_NO_CONDITION);
            return;
        }
        RecordHelper.model.remove({ _id: id }, (err) => {
            if (err) {
                DHLog_1.DHLog.d("remove by id error：" + err);
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_DELETE_ERROR);
            }
            else {
                DHLog_1.DHLog.d("remove by id success");
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_SUCCESS);
            }
        });
    }
    list(userId, callback) {
        if (!userId) {
            DHLog_1.DHLog.d("id error：" + userId);
            if (callback)
                callback(ResultCode_1.MONGODB_CODE.MC_NO_CONDITION, null);
            return;
        }
        RecordHelper.model.find({ userId: userId }, (err, ress) => {
            if (err) {
                DHLog_1.DHLog.d("find error:" + err);
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_SELECT_ERROR, null);
            }
            else {
                DHLog_1.DHLog.d("find");
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_SUCCESS, ress);
            }
        });
    }
}
exports.RecordHelper = RecordHelper;
