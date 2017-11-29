"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Path_1 = require("../../const/Path");
const BaseAPI_1 = require("./BaseAPI");
const bot_sdk_1 = require("@line/bot-sdk");
class LineWebhookAPI extends BaseAPI_1.BaseAPI {
    constructor() {
        super();
        this.pkgjson = require("../../../package.json");
        this.uri = Path_1.DHAPI.API_LINEBOT_PATH;
        console.log("LINE Chanel Id: " + this.pkgjson.linebot.channelId);
        console.log("LINE Chanel Secret: " + this.pkgjson.linebot.channelSecret);
        console.log("LINE Chanel Access Token: " + this.pkgjson.linebot.channelAccessToken);
        var config = {
            channelSecret: this.pkgjson.linebot.channelSecret,
            channelAccessToken: this.pkgjson.linebot.channelAccessToken
        };
        this.client = new bot_sdk_1.Client(config);
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