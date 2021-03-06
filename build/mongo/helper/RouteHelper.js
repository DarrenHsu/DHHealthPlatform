"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ConcreteHelper_1 = require("./ConcreteHelper");
const RouteSchema_1 = require("../schemas/RouteSchema");
const ResultCode_1 = require("../../routes/ResultCode");
const DHLog_1 = require("../../util/DHLog");
/**
 * @description 行程資料存取控制
 */
class RouteHelper extends ConcreteHelper_1.ConcreteHelper {
    constructor(connection) {
        super(connection);
        if (!RouteHelper.model) {
            RouteHelper.model = connection.model('route', RouteSchema_1.RouteSchema);
        }
    }
    save(id, data, callback) {
        if (!id) {
            DHLog_1.DHLog.d('id error：' + id);
            if (callback)
                callback(ResultCode_1.MONGODB_CODE.MC_NO_CONDITION_ERROR, null);
            return;
        }
        RouteHelper.model.findByIdAndUpdate(id, data).then((res) => {
            if (res) {
                DHLog_1.DHLog.d('find');
                res.name = data.name;
                res.lineUserId = data.lineUserId;
                res.startTime = data.startTime;
                res.endTime = data.endTime;
                res.modifyAt = new Date();
                res.save();
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_SUCCESS, res);
            }
            else {
                DHLog_1.DHLog.d('not find');
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_UPDATE_NOT_FOUND_ERROR, null);
            }
        }).catch((err) => {
            DHLog_1.DHLog.d('find by id and update error：' + err);
            if (callback)
                callback(ResultCode_1.MONGODB_CODE.MC_SELECT_ERROR, null);
        });
    }
    add(data, callback) {
        if (!data) {
            DHLog_1.DHLog.d('add data error ' + data);
            if (callback)
                callback(ResultCode_1.MONGODB_CODE.MC_NO_DATA_ERROR, null);
            return;
        }
        new RouteHelper.model(data).save().then((res) => {
            DHLog_1.DHLog.d('add data:' + JSON.stringify(res));
            if (callback)
                callback(ResultCode_1.MONGODB_CODE.MC_SUCCESS, res);
        }).catch((err) => {
            DHLog_1.DHLog.d('add error' + err);
            if (callback)
                callback(ResultCode_1.MONGODB_CODE.MC_INSERT_ERROR, null);
        });
    }
    remove(id, callback) {
        if (!id) {
            DHLog_1.DHLog.d('id error：' + id);
            if (callback)
                callback(ResultCode_1.MONGODB_CODE.MC_NO_CONDITION_ERROR);
            return;
        }
        this.modelRemove(RouteHelper.model, { _id: id }, callback);
    }
    find(lineUserId, callback) {
        if (!lineUserId) {
            DHLog_1.DHLog.d('id error：' + lineUserId);
            if (callback)
                callback(ResultCode_1.MONGODB_CODE.MC_NO_CONDITION_ERROR, null);
            return;
        }
        this.modelFind(RouteHelper.model, { lineUserId: lineUserId }, null, callback);
    }
}
exports.RouteHelper = RouteHelper;
