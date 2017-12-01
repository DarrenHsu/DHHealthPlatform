"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ChatroomSchema_1 = require("../schemas/ChatroomSchema");
const ResultCode_1 = require("../../routes/ResultCode");
const DHLog_1 = require("../../util/DHLog");
class ChatroomHelper {
    constructor(connection) {
        if (!ChatroomHelper.model) {
            ChatroomHelper.model = connection.model("chat", ChatroomSchema_1.ChatroomSchema);
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
        ChatroomHelper.model.findByIdAndUpdate(id, data, (err, res) => {
            if (err) {
                DHLog_1.DHLog.d("find by id and update error：" + err);
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_SELECT_ERROR, null);
                return;
            }
            if (res) {
                DHLog_1.DHLog.d("update:" + res._id);
                res.type = data.type;
                res.members = data.members;
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
        DHLog_1.DHLog.d("add " + JSON.stringify(data));
        if (!data) {
            DHLog_1.DHLog.d("add data error " + data);
            if (callback)
                callback(ResultCode_1.MONGODB_CODE.MC_NO_DATA, null);
            return;
        }
        ChatroomHelper.model.update({ userId: data.userId, chatId: data.chatId }, data, (err, raw) => {
            if (err) {
                DHLog_1.DHLog.d("count error:" + err);
                if (callback)
                    callback(ResultCode_1.MONGODB_CODE.MC_COUNT_ERROR, null);
                return;
            }
            DHLog_1.DHLog.d("raw:" + raw);
        });
        // ChatroomHelper.model.count({userId: data.userId, chatId: data.chatId}, (err, count) => {
        //     if (err) {
        //         DHLog.d("count error:" + err);
        //         if (callback) callback(MONGODB_CODE.MC_COUNT_ERROR, null);
        //         return;
        //     }
        //     if (count > 0) {
        //         DHLog.d("data exist!");
        //         if (callback) callback(MONGODB_CODE.MC_DATA_EXIST, null);
        //     }else {
        //         new ChatroomHelper.model(data).save((err, res, count) => {
        //             if (err) {
        //                 DHLog.d("add error" + err);
        //                 if (callback) callback(MONGODB_CODE.MC_INSERT_ERROR, null);
        //             }else {
        //                 DHLog.d("add data:" + res._id);
        //                 if (callback) callback(MONGODB_CODE.MC_SUCCESS, res);
        //             }
        //         });
        //     }
        // });
    }
    remove(id, callback) {
        DHLog_1.DHLog.d("remove id " + id);
        if (!id) {
            DHLog_1.DHLog.d("id error：" + id);
            if (callback)
                callback(ResultCode_1.MONGODB_CODE.MC_NO_CONDITION);
            return;
        }
        ChatroomHelper.model.remove({ _id: id }, (err) => {
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
        ChatroomHelper.model.find({ userId: userId }, (err, ress) => {
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
exports.ChatroomHelper = ChatroomHelper;
