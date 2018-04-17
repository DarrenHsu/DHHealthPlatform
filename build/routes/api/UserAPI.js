"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DHAPI_1 = require("../../const/DHAPI");
const DHLog_1 = require("../../util/DHLog");
const BaseAPI_1 = require("./BaseAPI");
const DBHelper_1 = require("../../mongo/helper/DBHelper");
const UserHelper_1 = require("../../mongo/helper/UserHelper");
/**
 * @description 使用者相關 api
 */
class UserAPI extends BaseAPI_1.BaseAPI {
    constructor(connection) {
        super();
        this.uri = DHAPI_1.DHAPI.API_USER_PATH;
        this.helper = new UserHelper_1.UserHelper(connection);
    }
    static create(router) {
        let api = new UserAPI(DBHelper_1.DBHelper.connection);
        DHLog_1.DHLog.d("[" + this.name + ":create] " + api.uri);
        api.get(router);
        api.post(router);
        api.put(router);
        api.delete(router);
    }
}
exports.UserAPI = UserAPI;
