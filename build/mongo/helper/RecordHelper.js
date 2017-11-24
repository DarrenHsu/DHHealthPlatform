"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RecordSchema_1 = require("../schemas/RecordSchema");
const BaseHelper_1 = require("./BaseHelper");
const ResultCode_1 = require("../../routes/ResultCode");
class RecordHelper extends BaseHelper_1.BaseHelper {
    constructor(connection) {
        super();
        if (!RecordHelper.model) {
            RecordHelper.model = connection.model("record", RecordSchema_1.RecordSchema);
        }
    }
    save(id, data, callback) {
        if (!data || !id) {
            console.log("data error：" + data);
            if (callback)
                callback(ResultCode_1.MONGODB_CODE.MC_NO_DATA, null);
            return;
        }
        RecordHelper.model.findByIdAndUpdate(id, data, (err, res) => {
            if (err) {
                console.log("find by id and update error：" + err);
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_SELECT_ERROR, null);
                return;
            }
            if (res) {
                console.log("update:" + res._id);
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_SUCCESS, res);
            }
            else {
                console.log("not update");
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_UPDATE_NOT_FOUND_ERROR, null);
            }
        });
    }
    add(data, callback) {
        if (!data) {
            console.log("add data error " + data);
            if (callback)
                callback(ResultCode_1.MONGODB_CODE.MC_NO_DATA, null);
            return;
        }
        new RecordHelper.model(data).save((err, res, count) => {
            if (err) {
                console.log("add error" + err);
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_INSERT_ERROR, null);
            }
            else {
                console.log("add data:" + res._id);
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_SUCCESS, res);
            }
        });
    }
    remove(id, callback) {
        if (!id) {
            console.log("id error：" + id);
            if (callback)
                callback(ResultCode_1.MONGODB_CODE.MC_NO_CONDITION);
            return;
        }
        RecordHelper.model.remove({ _id: id }, (err) => {
            if (err) {
                console.log("remove by id error：" + err);
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_DELETE_ERROR);
            }
            else {
                console.log("remove by id success");
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_SUCCESS);
            }
        });
    }
    list(userId, callback) {
        if (!userId) {
            console.log("id error：" + userId);
            if (callback)
                callback(ResultCode_1.MONGODB_CODE.MC_NO_CONDITION, null);
            return;
        }
        RecordHelper.model.find({ userId: userId }, (err, ress) => {
            if (err) {
                console.log("find error:" + err);
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_SELECT_ERROR, null);
            }
            else {
                console.log("find");
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_SUCCESS, ress);
            }
        });
    }
}
exports.RecordHelper = RecordHelper;
