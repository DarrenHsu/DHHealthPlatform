"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ResultCode_1 = require("../../routes/ResultCode");
const DHLog_1 = require("../../util/DHLog");
/**
 * @description 紀錄資料存取控制
 */
class ConcreteHelper {
    constructor(connection) { }
    save(id, data, callback) { }
    add(data, callback) { }
    remove(id, callback) { }
    find(id, callback) { }
    /* --------------- model 處理程序 ------------------ */
    modelFind(model, conditions, sort, callback) {
        model.find(conditions).sort(sort).then((ress) => {
            DHLog_1.DHLog.d('find ' + ress.length);
            if (callback)
                callback(ResultCode_1.MONGODB_CODE.MC_SUCCESS, ress);
        }).catch((err) => {
            DHLog_1.DHLog.d('find error:' + err);
            if (callback)
                callback(ResultCode_1.MONGODB_CODE.MC_SELECT_ERROR, null);
        });
    }
    modelFindOne(model, conditions, callback) {
        model.findOne(conditions).then((res) => {
            DHLog_1.DHLog.d('find ' + res);
            if (callback)
                callback(ResultCode_1.MONGODB_CODE.MC_SUCCESS, res);
        }).catch((err) => {
            DHLog_1.DHLog.d('find error:' + err);
            if (callback)
                callback(ResultCode_1.MONGODB_CODE.MC_SELECT_ERROR, null);
        });
    }
    modelRemove(model, conditions, callback) {
        model.remove(conditions).then((res) => {
            DHLog_1.DHLog.d('remove by id success');
            if (callback)
                callback(ResultCode_1.MONGODB_CODE.MC_SUCCESS);
        }).catch((err) => {
            DHLog_1.DHLog.d('remove by id error：' + err);
            if (callback)
                callback(ResultCode_1.MONGODB_CODE.MC_DELETE_ERROR);
        });
    }
}
exports.ConcreteHelper = ConcreteHelper;
