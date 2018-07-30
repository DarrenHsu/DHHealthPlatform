"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ConcreteHelper_1 = require("./ConcreteHelper");
const ChatroomSchema_1 = require("../schemas/ChatroomSchema");
const ResultCode_1 = require("../../routes/ResultCode");
const DHLog_1 = require("../../util/DHLog");
/**
 * @description line chat 資料存取控制
 */
class ChatroomHelper extends ConcreteHelper_1.ConcreteHelper {
    constructor(connection) {
        super(connection);
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
        ChatroomHelper.model.findByIdAndUpdate(id, data).then((res) => {
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
        ChatroomHelper.model.update({ chatId: data.chatId, lineUserId: data.lineUserId }, data, { multi: true }).then((raw) => {
            if (raw && (raw.n > 0 || raw.nModified > 0)) {
                DHLog_1.DHLog.d('update exist data');
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_SUCCESS, data);
                return;
            }
            new ChatroomHelper.model(data).save().then((res) => {
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
        this.modelRemove(ChatroomHelper.model, { _id: id }, callback);
    }
    find(lineUserId, callback) {
        if (!lineUserId) {
            DHLog_1.DHLog.d('id error：' + lineUserId);
            if (callback)
                callback(ResultCode_1.MONGODB_CODE.MC_NO_CONDITION_ERROR, null);
            return;
        }
        this.modelFind(ChatroomHelper.model, { lineUserId: lineUserId }, null, callback);
    }
}
exports.ChatroomHelper = ChatroomHelper;
