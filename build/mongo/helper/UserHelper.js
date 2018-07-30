"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ConcreteHelper_1 = require("./ConcreteHelper");
const UserSchema_1 = require("../schemas/UserSchema");
const ResultCode_1 = require("../../routes/ResultCode");
const DHLog_1 = require("../../util/DHLog");
/**
 * @description 使用者資料存取控制
 */
class UserHelper extends ConcreteHelper_1.ConcreteHelper {
    constructor(connection) {
        super(connection);
        if (!UserHelper.model) {
            UserHelper.model = connection.model('user', UserSchema_1.UserSchema);
        }
    }
    save(id, data, callback) {
        if (!id) {
            DHLog_1.DHLog.d('id error：' + id);
            if (callback)
                callback(ResultCode_1.MONGODB_CODE.MC_NO_CONDITION_ERROR, null);
            return;
        }
        UserHelper.model.findByIdAndUpdate(id, data).then((res) => {
            if (res) {
                DHLog_1.DHLog.d('find one and update');
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
        if (!data || !data.lineUserId) {
            DHLog_1.DHLog.d('add data error ' + data);
            if (callback)
                callback(ResultCode_1.MONGODB_CODE.MC_NO_DATA_ERROR, null);
            return;
        }
        UserHelper.model.count({ lineUserId: data.lineUserId }).then((count) => {
            if (count > 0) {
                DHLog_1.DHLog.d('data exist!');
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_DATA_EXIST, null);
                return;
            }
            new UserHelper.model(data).save().then((res) => {
                DHLog_1.DHLog.d('add data: ' + JSON.stringify(res));
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_SUCCESS, res);
            }).catch((err) => {
                DHLog_1.DHLog.d('add error:' + err);
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_INSERT_ERROR, null);
            });
        }).catch((err) => {
            DHLog_1.DHLog.d('count error:' + err);
            if (callback)
                callback(ResultCode_1.MONGODB_CODE.MC_COUNT_ERROR, null);
        });
    }
    remove(id, callback) {
        if (!id) {
            DHLog_1.DHLog.d('id error：' + id);
            if (callback)
                callback(ResultCode_1.MONGODB_CODE.MC_NO_CONDITION_ERROR);
            return;
        }
        this.modelRemove(UserHelper.model, { _id: id }, callback);
    }
    find(lineUserId, callback) {
        if (!lineUserId) {
            DHLog_1.DHLog.d('id error：' + lineUserId);
            if (callback)
                callback(ResultCode_1.MONGODB_CODE.MC_NO_CONDITION_ERROR, null);
            return;
        }
        UserHelper.model.find({ lineUserId: lineUserId }).then((ress) => {
            DHLog_1.DHLog.d('find ' + ress.length);
            if (ress.length == 0) {
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_NO_USER_DATA_ERROR, null);
            }
            else {
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_SUCCESS, ress);
            }
        }).catch((err) => {
            DHLog_1.DHLog.d('find error:' + err);
            if (callback)
                callback(ResultCode_1.MONGODB_CODE.MC_SELECT_ERROR, null);
        });
    }
}
exports.UserHelper = UserHelper;
