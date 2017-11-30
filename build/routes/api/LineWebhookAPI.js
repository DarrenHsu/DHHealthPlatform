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
        this.config = {
            channelSecret: this.pkgjson.linebot.channelSecret,
            channelAccessToken: this.pkgjson.linebot.channelAccessToken
        };
    }
    static create(router) {
        let api = new LineWebhookAPI();
        console.log("[LineWebhookAPI::create] Creating LineWebhookAPI route " + api.uri);
        api.get(router);
        api.post(router);
    }
    post(router) {
        router.post(this.uri, bot_sdk_1.middleware(this.config), (req, res, next) => {
            console.log("post !");
            console.log("header:" + JSON.stringify(req.headers));
            console.log("body:" + JSON.stringify(req.body));
            let client = new bot_sdk_1.Client(this.config);
            let event = req.body.events[0];
            if (event.type === "message") {
                client.replyMessage(event.replyToken, {
                    type: "text",
                    text: "你好我是聊天機器人",
                });
            }
            res.end();
        });
    }
    get(router) {
        router.get(this.uri, (req, res, next) => {
            console.log("get !");
            console.log("header:" + JSON.stringify(req.headers));
            console.log("body:" + JSON.stringify(req.body));
            res.end();
        });
    }
}
exports.LineWebhookAPI = LineWebhookAPI;
