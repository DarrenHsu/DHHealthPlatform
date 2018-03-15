"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LINE_CODE;
(function (LINE_CODE) {
    LINE_CODE[LINE_CODE["LL_SUCCESS"] = 0] = "LL_SUCCESS";
    LINE_CODE[LINE_CODE["LL_PUSH_MSG_ERROR"] = -1] = "LL_PUSH_MSG_ERROR";
    LINE_CODE[LINE_CODE["LL_LOGIN_ERROR"] = -2] = "LL_LOGIN_ERROR";
    LINE_CODE[LINE_CODE["LL_MOB_PROFILE_NOT_FOUND_ERROR"] = -3] = "LL_MOB_PROFILE_NOT_FOUND_ERROR";
})(LINE_CODE = exports.LINE_CODE || (exports.LINE_CODE = {}));
var CONNECTION_CODE;
(function (CONNECTION_CODE) {
    CONNECTION_CODE[CONNECTION_CODE["CC_SUCCESS"] = 0] = "CC_SUCCESS";
    CONNECTION_CODE[CONNECTION_CODE["CC_PARAMETER_ERROR"] = -1] = "CC_PARAMETER_ERROR";
    CONNECTION_CODE[CONNECTION_CODE["CC_REQUEST_BODY_ERROR"] = -2] = "CC_REQUEST_BODY_ERROR";
    CONNECTION_CODE[CONNECTION_CODE["CC_AUTH_ERROR"] = -3] = "CC_AUTH_ERROR";
})(CONNECTION_CODE = exports.CONNECTION_CODE || (exports.CONNECTION_CODE = {}));
var MONGODB_CODE;
(function (MONGODB_CODE) {
    MONGODB_CODE[MONGODB_CODE["MC_DATA_EXIST"] = 1] = "MC_DATA_EXIST";
    MONGODB_CODE[MONGODB_CODE["MC_SUCCESS"] = 0] = "MC_SUCCESS";
    MONGODB_CODE[MONGODB_CODE["MC_INSERT_ERROR"] = -1] = "MC_INSERT_ERROR";
    MONGODB_CODE[MONGODB_CODE["MC_UPDATE_ERROR"] = -2] = "MC_UPDATE_ERROR";
    MONGODB_CODE[MONGODB_CODE["MC_SELECT_ERROR"] = -3] = "MC_SELECT_ERROR";
    MONGODB_CODE[MONGODB_CODE["MC_DELETE_ERROR"] = -4] = "MC_DELETE_ERROR";
    MONGODB_CODE[MONGODB_CODE["MC_INSERT_EXIST_ERROR"] = -5] = "MC_INSERT_EXIST_ERROR";
    MONGODB_CODE[MONGODB_CODE["MC_UPDATE_NOT_FOUND_ERROR"] = -6] = "MC_UPDATE_NOT_FOUND_ERROR";
    MONGODB_CODE[MONGODB_CODE["MC_DELETE_NOT_FOUND_ERROR"] = -7] = "MC_DELETE_NOT_FOUND_ERROR";
    MONGODB_CODE[MONGODB_CODE["MC_COUNT_ERROR"] = -8] = "MC_COUNT_ERROR";
    MONGODB_CODE[MONGODB_CODE["MC_LIST_NO_DATA_ERROR"] = -9] = "MC_LIST_NO_DATA_ERROR";
    MONGODB_CODE[MONGODB_CODE["MC_NO_USER_DATA_ERROR"] = -97] = "MC_NO_USER_DATA_ERROR";
    MONGODB_CODE[MONGODB_CODE["MC_NO_DATA_ERROR"] = -98] = "MC_NO_DATA_ERROR";
    MONGODB_CODE[MONGODB_CODE["MC_NO_CONDITION_ERROR"] = -99] = "MC_NO_CONDITION_ERROR";
})(MONGODB_CODE = exports.MONGODB_CODE || (exports.MONGODB_CODE = {}));
class ResultMsg {
}
ResultMsg.LL_SUCCESS = "執行成功";
ResultMsg.LL_PUSH_MSG_ERROR = "發送訊息失敗";
ResultMsg.LL_LOGIN_ERROR = "LINE帳號登入失敗，請您確認您的帳園密碼是否正確。";
ResultMsg.LL_MOB_PROFILE_NOT_FOUND_ERROR = "請至手機版運動紀錄登入您的LINE帳號後在進行網站登入。";
ResultMsg.CC_SUCCESS = "執行成功";
ResultMsg.CC_PARAMETER_ERROR = "輸入的參數有誤";
ResultMsg.CC_REQUEST_BODY_ERROR = "傳入的資料有誤";
ResultMsg.CC_AUTH_ERROR = "認證失敗";
ResultMsg.MC_DATA_EXIST = "資料已存在";
ResultMsg.MC_SUCCESS = "執行成功";
ResultMsg.MC_INSERT_ERROR = "新增失敗";
ResultMsg.MC_UPDATE_ERROR = "更新失敗";
ResultMsg.MC_SELECT_ERROR = "查詢失敗";
ResultMsg.MC_DELETE_ERROR = "刪除失敗";
ResultMsg.MC_INSERT_EXIST_ERROR = "新增了重覆的資料";
ResultMsg.MC_UPDATE_NOT_FOUND_ERROR = "找不到可以更新的資料";
ResultMsg.MC_DELETE_NOT_FOUND_ERROR = "找不到可以刪除的資料";
ResultMsg.MC_COUNT_ERROR = "取得數量失敗";
ResultMsg.MC_LIST_NO_DATA_ERROR = "查無任何資料";
ResultMsg.MC_NO_USER_DATA_ERROR = "查無會員資料";
ResultMsg.MC_NO_DATA_ERROR = "無傳入處理資料";
ResultMsg.MC_NO_CONDITION_ERROR = "無傳入選擇條件";
class ResultCodeMsg {
    static getMsg(code) {
        switch (code) {
            case LINE_CODE.LL_SUCCESS:
                return ResultMsg.LL_SUCCESS;
            case LINE_CODE.LL_PUSH_MSG_ERROR:
                return ResultMsg.LL_PUSH_MSG_ERROR;
            case LINE_CODE.LL_LOGIN_ERROR:
                return ResultMsg.LL_LOGIN_ERROR;
            case LINE_CODE.LL_MOB_PROFILE_NOT_FOUND_ERROR:
                return ResultMsg.LL_MOB_PROFILE_NOT_FOUND_ERROR;
            case CONNECTION_CODE.CC_SUCCESS:
                return ResultMsg.CC_SUCCESS;
            case CONNECTION_CODE.CC_PARAMETER_ERROR:
                return ResultMsg.CC_PARAMETER_ERROR;
            case CONNECTION_CODE.CC_REQUEST_BODY_ERROR:
                return ResultMsg.CC_REQUEST_BODY_ERROR;
            case CONNECTION_CODE.CC_AUTH_ERROR:
                return ResultMsg.CC_AUTH_ERROR;
            case MONGODB_CODE.MC_DATA_EXIST:
                return ResultMsg.MC_DATA_EXIST;
            case MONGODB_CODE.MC_SUCCESS:
                return ResultMsg.MC_SUCCESS;
            case MONGODB_CODE.MC_INSERT_ERROR:
                return ResultMsg.MC_INSERT_ERROR;
            case MONGODB_CODE.MC_UPDATE_ERROR:
                return ResultMsg.MC_UPDATE_ERROR;
            case MONGODB_CODE.MC_SELECT_ERROR:
                return ResultMsg.MC_SELECT_ERROR;
            case MONGODB_CODE.MC_DELETE_ERROR:
                return ResultMsg.MC_DELETE_ERROR;
            case MONGODB_CODE.MC_INSERT_EXIST_ERROR:
                return ResultMsg.MC_INSERT_EXIST_ERROR;
            case MONGODB_CODE.MC_UPDATE_NOT_FOUND_ERROR:
                return ResultMsg.MC_UPDATE_NOT_FOUND_ERROR;
            case MONGODB_CODE.MC_DELETE_NOT_FOUND_ERROR:
                return ResultMsg.MC_DELETE_NOT_FOUND_ERROR;
            case MONGODB_CODE.MC_COUNT_ERROR:
                return ResultMsg.MC_COUNT_ERROR;
            case MONGODB_CODE.MC_LIST_NO_DATA_ERROR:
                return ResultMsg.MC_LIST_NO_DATA_ERROR;
            case MONGODB_CODE.MC_NO_USER_DATA_ERROR:
                return ResultMsg.MC_NO_USER_DATA_ERROR;
            case MONGODB_CODE.MC_NO_DATA_ERROR:
                return ResultMsg.MC_NO_DATA_ERROR;
            case MONGODB_CODE.MC_NO_CONDITION_ERROR:
                return ResultMsg.MC_NO_CONDITION_ERROR;
            default:
                return ResultMsg.MC_SUCCESS;
        }
    }
}
exports.ResultCodeMsg = ResultCodeMsg;
