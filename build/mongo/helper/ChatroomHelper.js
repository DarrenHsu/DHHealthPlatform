"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ChatroomSchema_1 = require("../schemas/ChatroomSchema");
const ResultCode_1 = require("../../routes/ResultCode");
const DHLog_1 = require("../../util/DHLog");
/**
 * @description line chat 資料存取控制
 */
class ChatroomHelper {
    constructor(connection) {
        if (!ChatroomHelper.model) {
            ChatroomHelper.model = connection.model('chat', ChatroomSchema_1.ChatroomSchema);
        }
    }
    save(id, data, callback) {
        if (!data || !id) {
            DHLog_1.DHLog.d('data error：' + data);
            if (callback)
                callback(ResultCode_1.MONGODB_CODE.MC_NO_DATA_ERROR, null);
            return;
        }
        ChatroomHelper.model.findByIdAndUpdate(id, data, (err, res) => {
            if (err) {
                DHLog_1.DHLog.d('find by id and update error：' + err);
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_SELECT_ERROR, null);
                return;
            }
            if (res) {
                DHLog_1.DHLog.d('update:' + res._id);
                res.type = data.type;
                res.modifyAt = new Date();
                res.save();
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_SUCCESS, res);
            }
            else {
                DHLog_1.DHLog.d('not update');
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_UPDATE_NOT_FOUND_ERROR, null);
            }
        });
    }
    add(data, callback) {
        if (!data) {
            DHLog_1.DHLog.d('add data error ' + data);
            if (callback)
                callback(ResultCode_1.MONGODB_CODE.MC_NO_DATA_ERROR, null);
            return;
        }
        ChatroomHelper.model.update({ chatId: data.chatId, lineUserId: data.lineUserId }, data, { multi: true }, (err, raw) => {
            if (err) {
                DHLog_1.DHLog.d('count error:' + err);
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_COUNT_ERROR, null);
                return;
            }
            DHLog_1.DHLog.d('raw:' + JSON.stringify(raw));
            if (raw && (raw.n > 0 || raw.nModified > 0)) {
                DHLog_1.DHLog.d('update exist data');
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_SUCCESS, data);
            }
            else {
                new ChatroomHelper.model(data).save((err, res, count) => {
                    if (err) {
                        DHLog_1.DHLog.d('add error' + err);
                        if (callback)
                            callback(ResultCode_1.MONGODB_CODE.MC_INSERT_ERROR, null);
                    }
                    else {
                        DHLog_1.DHLog.d('add data:' + JSON.stringify(res));
                        if (callback)
                            callback(ResultCode_1.MONGODB_CODE.MC_SUCCESS, res);
                    }
                });
            }
        });
    }
    remove(id, callback) {
        if (!id) {
            DHLog_1.DHLog.d('id error：' + id);
            if (callback)
                callback(ResultCode_1.MONGODB_CODE.MC_NO_CONDITION_ERROR);
            return;
        }
        ChatroomHelper.model.remove({ _id: id }, (err) => {
            if (err) {
                DHLog_1.DHLog.d('remove by id error：' + err);
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_DELETE_ERROR);
            }
            else {
                DHLog_1.DHLog.d('remove by id success');
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_SUCCESS);
            }
        });
    }
    find(lineUserId, callback) {
        if (!lineUserId) {
            DHLog_1.DHLog.d('id error：' + lineUserId);
            if (callback)
                callback(ResultCode_1.MONGODB_CODE.MC_NO_CONDITION_ERROR, null);
            return;
        }
        ChatroomHelper.model.find({ lineUserId: lineUserId }, (err, ress) => {
            if (err) {
                DHLog_1.DHLog.d('find error:' + err);
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_SELECT_ERROR, null);
            }
            else {
                DHLog_1.DHLog.d('find ' + ress.length);
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_SUCCESS, ress);
            }
        });
    }
}
exports.ChatroomHelper = ChatroomHelper;
