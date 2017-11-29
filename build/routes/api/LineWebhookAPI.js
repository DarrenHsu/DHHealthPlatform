"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Path_1 = require("../../const/Path");
const BaseAPI_1 = require("./BaseAPI");
const crypto_1 = require("crypto");
class LineWebhookAPI extends BaseAPI_1.BaseAPI {
    constructor() {
        super();
        this.pkgjson = require("../../../package.json");
        this.uri = Path_1.DHAPI.API_LINEBOT_PATH;
        var body = {
            "message": "tjos is a test"
        };
        console.log("LINE Chanel Id: " + this.pkgjson.linebot.channelId);
        console.log("LINE Chanel Secret: " + this.pkgjson.linebot.channelSecret);
        console.log("LINE Chanel Access Token: " + this.pkgjson.linebot.channelAccessToken);
        var digest = crypto_1.createHmac("SHA256", this.pkgjson.linebot.channelSecret).update(JSON.stringify(body)).digest("base64");
        console.log("digest " + digest);
    }
    static create(router) {
        let api = new LineWebhookAPI();
        console.log("[LineWebhookAPI::create] Creating LineWebhookAPI route " + api.uri);
        api.post(router);
    }
    post(router) {
    }
}
exports.LineWebhookAPI = LineWebhookAPI;
