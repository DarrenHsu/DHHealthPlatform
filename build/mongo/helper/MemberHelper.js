"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MemberSchema_1 = require("../schemas/MemberSchema");
const ResultCode_1 = require("../../routes/ResultCode");
const DHLog_1 = require("../../util/DHLog");
class MemberHelper {
    constructor(connection) {
        if (!MemberHelper.model) {
            MemberHelper.model = connection.model("chat", MemberSchema_1.MemberSchema);
        }
    }
    save(id, data, callback) {
        DHLog_1.DHLog.d("save id " + id + JSON.stringify(data));
        if (!data || !id) {
            DHLog_1.DHLog.d("data error：" + data);
            if (callback)
                callback(ResultCode_1.MONGODB_CODE.MC_NO_DATA, null);
            return;
        }
        MemberHelper.model.findByIdAndUpdate(id, data, (err, res) => {
            if (err) {
                DHLog_1.DHLog.d("find by id and update error：" + err);
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_SELECT_ERROR, null);
                return;
            }
            if (res) {
                DHLog_1.DHLog.d("update:" + res._id);
                res.lineUserId = data.lineUserId;
                res.displayNmae = data.displayNmae;
                res.pictureUrl = data.pictureUrl;
                res.modifyAt = new Date();
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
        DHLog_1.DHLog.d("add id " + JSON.stringify(data));
        if (!data) {
            DHLog_1.DHLog.d("add data error " + data);
            if (callback)
                callback(ResultCode_1.MONGODB_CODE.MC_NO_DATA, null);
            return;
        }
        MemberHelper.model.count({ lineUserId: data.lineUserId }, (err, count) => {
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
                new MemberHelper.model(data).save((err, res, count) => {
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
        });
    }
    remove(id, callback) {
        DHLog_1.DHLog.d("remove id " + id);
        if (!id) {
            DHLog_1.DHLog.d("id error：" + id);
            if (callback)
                callback(ResultCode_1.MONGODB_CODE.MC_NO_CONDITION);
            return;
        }
        MemberHelper.model.remove({ _id: id }, (err) => {
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
        DHLog_1.DHLog.d("list id " + userId);
        if (!userId) {
            DHLog_1.DHLog.d("id error：" + userId);
            if (callback)
                callback(ResultCode_1.MONGODB_CODE.MC_NO_CONDITION, null);
            return;
        }
        MemberHelper.model.find({ userId: userId }, (err, ress) => {
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
exports.MemberHelper = MemberHelper;
