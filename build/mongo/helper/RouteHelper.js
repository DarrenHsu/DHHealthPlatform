"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RouteSchema_1 = require("../schemas/RouteSchema");
const ResultCode_1 = require("../../routes/ResultCode");
const DHLog_1 = require("../../util/DHLog");
class RouteHelper {
    constructor(connection) {
        if (!RouteHelper.model) {
            RouteHelper.model = connection.model("route", RouteSchema_1.RouteSchema);
        }
    }
    save(id, data, callback) {
        if (!id) {
            DHLog_1.DHLog.d("id error：" + id);
            if (callback)
                callback(ResultCode_1.MONGODB_CODE.MC_NO_CONDITION_ERROR, null);
            return;
        }
        RouteHelper.model.findByIdAndUpdate(id, data, (err, res) => {
            if (err) {
                DHLog_1.DHLog.d("find by id and update error：" + err);
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_SELECT_ERROR, null);
                return;
            }
            if (res) {
                DHLog_1.DHLog.d("find");
                res.name = data.name;
                res.lineUserId = data.lineUserId;
                res.startDate = data.startDate;
                res.startTime = data.startTime;
                res.endTime = data.endTime;
                res.modifyAt = new Date();
                res.save();
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_SUCCESS, res);
            }
            else {
                DHLog_1.DHLog.d("not find");
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_UPDATE_NOT_FOUND_ERROR, null);
            }
        });
    }
    add(data, callback) {
        if (!data) {
            DHLog_1.DHLog.d("add data error " + data);
            if (callback)
                callback(ResultCode_1.MONGODB_CODE.MC_NO_DATA_ERROR, null);
            return;
        }
        new RouteHelper.model(data).save((err, res, count) => {
            if (err) {
                DHLog_1.DHLog.d("add error" + err);
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_INSERT_ERROR, null);
            }
            else {
                DHLog_1.DHLog.d("add data:" + JSON.stringify(res));
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_SUCCESS, res);
            }
        });
    }
    remove(id, callback) {
        if (!id) {
            DHLog_1.DHLog.d("id error：" + id);
            if (callback)
                callback(ResultCode_1.MONGODB_CODE.MC_NO_CONDITION_ERROR);
            return;
        }
        RouteHelper.model.remove({ _id: id }, (err) => {
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
    list(lineUserId, callback) {
        if (!lineUserId) {
            DHLog_1.DHLog.d("id error：" + lineUserId);
            if (callback)
                callback(ResultCode_1.MONGODB_CODE.MC_NO_CONDITION_ERROR, null);
            return;
        }
        RouteHelper.model.find({ lineUserId: lineUserId }, (err, ress) => {
            if (err) {
                DHLog_1.DHLog.d("find error:" + err);
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_SELECT_ERROR, null);
            }
            else {
                DHLog_1.DHLog.d("find " + ress.length);
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_SUCCESS, ress);
            }
        });
    }
}
exports.RouteHelper = RouteHelper;
