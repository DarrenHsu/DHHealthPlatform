"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserSchema_1 = require("../schemas/UserSchema");
const ResultCode_1 = require("../../routes/ResultCode");
const DHLog_1 = require("../../util/DHLog");
class UserHelper {
    constructor(connection) {
        if (!UserHelper.model) {
            UserHelper.model = connection.model("user", UserSchema_1.UserSchema);
        }
    }
    save(id, data, callback) {
        if (!id) {
            DHLog_1.DHLog.d("id error：" + id);
            if (callback)
                callback(ResultCode_1.MONGODB_CODE.MC_NO_CONDITION, null);
            return;
        }
        UserHelper.model.findByIdAndUpdate(id, data, (err, res) => {
            if (err) {
                DHLog_1.DHLog.d("find by id and update error：" + err);
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_SELECT_ERROR, null);
                return;
            }
            if (res) {
                DHLog_1.DHLog.d("find");
                res.name = data.name;
                res.age = data.age;
                res.height = data.height;
                res.weight = data.weight;
                res.gmail = data.gmail;
                res.lineUserId = data.lineUserId;
                res.pictureUrl = data.pictureUrl;
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
        if (!data || !data.lineUserId) {
            DHLog_1.DHLog.d("add data error " + data);
            if (callback)
                callback(ResultCode_1.MONGODB_CODE.MC_NO_DATA, null);
            return;
        }
        UserHelper.model.count({ lineUserId: data.lineUserId }, (err, count) => {
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
                new UserHelper.model(data).save((err, res, count) => {
                    if (err) {
                        DHLog_1.DHLog.d("add error:" + err);
                        if (callback)
                            callback(ResultCode_1.MONGODB_CODE.MC_INSERT_ERROR, null);
                    }
                    else {
                        DHLog_1.DHLog.d("add data:" + res.toJSON.toString);
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
                callback(ResultCode_1.MONGODB_CODE.MC_NO_CONDITION);
            return;
        }
        UserHelper.model.remove({ _id: id }, (err) => {
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
    list(lineUserId, callback) {
        if (!lineUserId) {
            DHLog_1.DHLog.d("id error：" + lineUserId);
            if (callback)
                callback(ResultCode_1.MONGODB_CODE.MC_NO_CONDITION, null);
            return;
        }
        UserHelper.model.find({ lineUserId: lineUserId }, (err, ress) => {
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
exports.UserHelper = UserHelper;
