"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseAPI_1 = require("./BaseAPI");
const DBHelper_1 = require("../../mongo/helper/DBHelper");
const RouteHelper_1 = require("../../mongo/helper/RouteHelper");
const Path_1 = require("../../const/Path");
class RouteAPI extends BaseAPI_1.BaseAPI {
    constructor(connection) {
        super();
        this.uri = Path_1.DHAPI.API_ROUTE_PATH;
        this.helper = new RouteHelper_1.RouteHelper(connection);
    }
    static create(router) {
        let api = new RouteAPI(DBHelper_1.DBHelper.connection);
        console.log("[RecordAPI::create] Creating RecordAPI route " + api.uri);
        api.get(router);
        api.post(router);
        api.put(router);
        api.delete(router);
    }
}
exports.RouteAPI = RouteAPI;
