"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseAPI_1 = require("./BaseAPI");
class LineWebhookAPI extends BaseAPI_1.BaseAPI {
    constructor() {
        super();
        this.pkgjson = require("../../package.json");
    }
    static create(router) {
        let api = new LineWebhookAPI();
        console.log("[RecordAPI::create] Creating RecordAPI route " + api.uri);
        api.post(router);
    }
    post(router) {
    }
}
exports.LineWebhookAPI = LineWebhookAPI;
