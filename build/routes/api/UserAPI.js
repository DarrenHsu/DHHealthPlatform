"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseAPI_1 = require("./BaseAPI");
const DBHelper_1 = require("../../mongo/helper/DBHelper");
const UserHelper_1 = require("../../mongo/helper/UserHelper");
const Path_1 = require("../../const/Path");
class UserAPI extends BaseAPI_1.BaseAPI {
    constructor(connection) {
        super();
        this.uri = Path_1.DHAPI.API_USER_PATH;
        this.helper = new UserHelper_1.UserHelper(connection);
    }
    static create(router) {
        let api = new UserAPI(DBHelper_1.DBHelper.connection);
        console.log("[RecordAPI::create] Creating RecordAPI route " + api.uri);
        api.get(router);
        api.post(router);
        api.put(router);
        api.delete(router);
    }
}
exports.UserAPI = UserAPI;