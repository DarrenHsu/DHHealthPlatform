"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Path_1 = require("../../const/Path");
const BaseAPI_1 = require("./BaseAPI");
const crypto_1 = require("crypto");
const bot_sdk_1 = require("@line/bot-sdk");
class LineWebhookAPI extends BaseAPI_1.BaseAPI {
    constructor() {
        super();
        this.pkgjson = require("../../../package.json");
        this.uri = Path_1.DHAPI.API_LINEBOT_PATH;
        this.clientConfig = {
            channelAccessToken: this.pkgjson.linebot.channelAccessToken
        };
        this.middlewareConfig = {
            channelSecret: this.pkgjson.linebot.channelSecret
        };
    }
    static create(router) {
        let api = new LineWebhookAPI();
        console.log("[LineWebhookAPI::create] Creating LineWebhookAPI route " + api.uri);
        api.post(router);
    }
    static getSignature(body, screat) {
        let signature = crypto_1.createHmac('SHA256', screat).update(body).digest('base64');
        return signature;
    }
    runValidateSignature(req) {
        console.log("x-line-signature = " + req.headers["x-line-signature"]);
        console.log("x-line-signature = " + LineWebhookAPI.getSignature(JSON.stringify(req.body), this.middlewareConfig.channelSecret));
        return bot_sdk_1.validateSignature(JSON.stringify(req.body), this.middlewareConfig.channelSecret, req.headers["x-line-signature"].toString());
    }
    post(router) {
        router.post(this.uri, (req, res, next) => {
            if (!this.runValidateSignature(req))
                return;
            console.log("header:" + JSON.stringify(req.headers));
            console.log("body:" + JSON.stringify(req.body));
            let event = req.body.events[0];
            if (event.type === "message") {
                let client = new bot_sdk_1.Client(this.clientConfig);
                client.replyMessage(event.replyToken, {
                    type: "text",
                    text: "你好，我是聊天機器人",
                });
            }
        });
    }
}
exports.LineWebhookAPI = LineWebhookAPI;
