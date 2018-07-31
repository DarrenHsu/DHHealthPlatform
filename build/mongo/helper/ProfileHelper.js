"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ConcreteHelper_1 = require("./ConcreteHelper");
const ProfileSchema_1 = require("../schemas/ProfileSchema");
const ResultCode_1 = require("../../routes/ResultCode");
const DHLog_1 = require("../../util/DHLog");
/**
 * @description line chat 資料存取控制
 */
class ProfileHelper extends ConcreteHelper_1.ConcreteHelper {
    constructor(connection) {
        super(connection);
        if (!ProfileHelper.model) {
            ProfileHelper.model = connection.model('profile', ProfileSchema_1.ProfileSchema);
        }
    }
    save(id, data, callback) {
        if (!data || !id) {
            DHLog_1.DHLog.d('data error：' + data);
            if (callback)
                callback(ResultCode_1.MONGODB_CODE.MC_NO_DATA_ERROR, null);
            return;
        }
        ProfileHelper.model.findByIdAndUpdate(id, data).then((res) => {
            if (!res) {
                DHLog_1.DHLog.d('not update');
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_UPDATE_NOT_FOUND_ERROR, null);
                return;
            }
            DHLog_1.DHLog.d('update:' + res._id);
            res.lineUserId = data.lineUserId;
            res.displayName = data.displayName;
            res.pictureUrl = data.pictureUrl;
            res.save();
            if (callback)
                callback(ResultCode_1.MONGODB_CODE.MC_SUCCESS, res);
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
        ProfileHelper.model.update({ lineUserId: data.lineUserId }, data, { multi: true }).then((raw) => {
            if (raw && (raw.n > 0 || raw.nModified > 0)) {
                DHLog_1.DHLog.d('update exist data');
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_SUCCESS, data);
                return;
            }
            new ProfileHelper.model(data).save().then((res) => {
                DHLog_1.DHLog.d('add data:' + JSON.stringify(res));
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_SUCCESS, res);
            }).catch((err) => {
                DHLog_1.DHLog.d('add error' + err);
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
        this.modelRemove(ProfileHelper.model, { _id: id }, callback);
    }
    find(lineUserId, callback) {
        if (!lineUserId) {
            DHLog_1.DHLog.d('id error：' + lineUserId);
            if (callback)
                callback(ResultCode_1.MONGODB_CODE.MC_NO_CONDITION_ERROR, null);
            return;
        }
        this.modelFind(ProfileHelper.model, { lineUserId: lineUserId }, null, callback);
    }
}
exports.ProfileHelper = ProfileHelper;
