"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseAPI_1 = require("./BaseAPI");
const DBHelper_1 = require("../../mongo/helper/DBHelper");
const RecordHelper_1 = require("../../mongo/helper/RecordHelper");
const Path_1 = require("../../const/Path");
const DHLog_1 = require("../../util/DHLog");
class RecordAPI extends BaseAPI_1.BaseAPI {
    constructor(connection) {
        super();
        this.uri = Path_1.DHAPI.API_RECORD_PATH;
        this.helper = new RecordHelper_1.RecordHelper(connection);
    }
    static create(router) {
        let api = new RecordAPI(DBHelper_1.DBHelper.connection);
        DHLog_1.DHLog.d("[" + this.name + ":create] " + api.uri);
        api.get(router);
        api.post(router);
        api.put(router);
        api.delete(router);
    }
}
exports.RecordAPI = RecordAPI;
