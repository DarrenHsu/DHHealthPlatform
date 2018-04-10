"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AuthSchema_1 = require("../schemas/AuthSchema");
const ResultCode_1 = require("../../routes/ResultCode");
const DHLog_1 = require("../../util/DHLog");
class AuthHelper {
    constructor(connection) {
        if (!AuthHelper.model) {
            AuthHelper.model = connection.model("Auth", AuthSchema_1.AuthSchema);
        }
    }
    save(id, data, callback) {
        if (!id) {
            DHLog_1.DHLog.d("id error：" + id);
            if (callback)
                callback(ResultCode_1.MONGODB_CODE.MC_NO_CONDITION_ERROR, null);
            return;
        }
        AuthHelper.model.findByIdAndUpdate(id, data, (err, res) => {
            if (err) {
                DHLog_1.DHLog.d("find by id and update error：" + err);
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_SELECT_ERROR, null);
                return;
            }
            if (res) {
                DHLog_1.DHLog.d("find");
                res.googleToken = data.googleToken;
                res.googleTokenExpire = data.googleTokenExpire;
                res.lineToken = data.lineToken;
                res.lineTokenExpire = data.lineTokenExpire;
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
        if (!data || !data.lineUserId) {
            DHLog_1.DHLog.d("add data error " + data);
            if (callback)
                callback(ResultCode_1.MONGODB_CODE.MC_NO_DATA_ERROR, null);
            return;
        }
        AuthHelper.model.count({ lineUserId: data.lineUserId }, (err, count) => {
            if (err) {
                DHLog_1.DHLog.d("count error:" + err);
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_COUNT_ERROR, null);
                return;
            }
            if (count > 0) {
                DHLog_1.DHLog.d("data exist!");
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_DATA_EXIST, null);
            }
            else {
                new AuthHelper.model(data).save((err, res, count) => {
                    if (err) {
                        DHLog_1.DHLog.d("add error:" + err);
                        if (callback)
                            callback(ResultCode_1.MONGODB_CODE.MC_INSERT_ERROR, null);
                    }
                    else {
                        DHLog_1.DHLog.d("add data: " + JSON.stringify(res));
                        if (callback)
                            callback(ResultCode_1.MONGODB_CODE.MC_SUCCESS, res);
                    }
                });
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
        AuthHelper.model.remove({ _id: id }, (err) => {
            if (err) {
                DHLog_1.DHLog.d("remove by id error：" + err);
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_DELETE_NOT_FOUND_ERROR);
            }
            else {
                DHLog_1.DHLog.d("remove by id success");
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_SUCCESS);
            }
        });
    }
    findOne(lineUserId, callback) {
        if (!lineUserId) {
            DHLog_1.DHLog.d("id error：" + lineUserId);
            if (callback)
                callback(ResultCode_1.MONGODB_CODE.MC_NO_CONDITION_ERROR, null);
            return;
        }
        AuthHelper.model.findOne({ lineUserId: lineUserId }, (err, res) => {
            if (err) {
                DHLog_1.DHLog.d("find error:" + err);
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_SELECT_ERROR, null);
            }
            else {
                DHLog_1.DHLog.d("find auth");
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_SELECT_ERROR, res);
            }
        });
    }
    find(lineUserId, callback) {
        if (!lineUserId) {
            DHLog_1.DHLog.d("id error：" + lineUserId);
            if (callback)
                callback(ResultCode_1.MONGODB_CODE.MC_NO_CONDITION_ERROR, null);
            return;
        }
        AuthHelper.model.find({ lineUserId: lineUserId }, (err, ress) => {
            if (err) {
                DHLog_1.DHLog.d("find error:" + err);
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_SELECT_ERROR, null);
            }
            else {
                DHLog_1.DHLog.d("find " + ress.length);
                if (ress.length == 0) {
                    if (callback)
                        callback(ResultCode_1.MONGODB_CODE.MC_NO_USER_DATA_ERROR, null);
                }
                else {
                    if (callback)
                        callback(ResultCode_1.MONGODB_CODE.MC_SUCCESS, ress);
                }
            }
        });
    }
}
exports.AuthHelper = AuthHelper;
