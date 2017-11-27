"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserSchema_1 = require("../schemas/UserSchema");
const ResultCode_1 = require("../../routes/ResultCode");
class UserHelper {
    constructor(connection) {
        if (!UserHelper.model) {
            UserHelper.model = connection.model("user", UserSchema_1.UserSchema);
        }
    }
    save(id, data, callback) {
        if (!id) {
            console.log("id error：" + id);
            if (callback)
                callback(ResultCode_1.MONGODB_CODE.MC_NO_CONDITION, null);
            return;
        }
        UserHelper.model.findByIdAndUpdate(id, data, (err, res) => {
            if (err) {
                console.log("find by id and update error：" + err);
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_SELECT_ERROR, null);
                return;
            }
            if (res) {
                console.log("find");
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_SUCCESS, res);
            }
            else {
                console.log("not find");
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_UPDATE_NOT_FOUND_ERROR, null);
            }
        });
    }
    add(data, callback) {
        if (!data || !data.gmail) {
            console.log("add data error " + data);
            if (callback)
                callback(ResultCode_1.MONGODB_CODE.MC_NO_DATA, null);
            return;
        }
        UserHelper.model.count({ gmail: data.gmail }, (err, count) => {
            if (err) {
                console.log("count error:" + err);
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_COUNT_ERROR, null);
                return;
            }
            if (count > 0) {
                console.log("data exist!");
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_DATA_EXIST, null);
            }
            else {
                new UserHelper.model(data).save((err, res, count) => {
                    if (err) {
                        console.log("add error:" + err);
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
        });
    }
    remove(id, callback) {
        if (!id) {
            console.log("id error：" + id);
            if (callback)
                callback(ResultCode_1.MONGODB_CODE.MC_NO_CONDITION);
            return;
        }
        UserHelper.model.remove({ _id: id }, (err) => {
            if (err) {
                console.log("remove by id error：" + err);
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_DELETE_NOT_FOUND_ERROR);
            }
            else {
                console.log("remove by id success");
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_SUCCESS);
            }
        });
    }
    list(id, callback) {
        if (!id) {
            console.log("id error：" + id);
            if (callback)
                callback(ResultCode_1.MONGODB_CODE.MC_NO_CONDITION, null);
            return;
        }
        UserHelper.model.find({ _id: id }, (err, ress) => {
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
exports.UserHelper = UserHelper;
