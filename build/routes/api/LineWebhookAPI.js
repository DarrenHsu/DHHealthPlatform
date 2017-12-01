"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Path_1 = require("../../const/Path");
const BaseAPI_1 = require("./BaseAPI");
const crypto_1 = require("crypto");
const bot_sdk_1 = require("@line/bot-sdk");
const DHLog_1 = require("../../util/DHLog");
const ChatroomHelper_1 = require("../../mongo/helper/ChatroomHelper");
const DBHelper_1 = require("../../mongo/helper/DBHelper");
class LineWebhookAPI extends BaseAPI_1.BaseAPI {
    constructor(connection) {
        super();
        this.pkgjson = require("../../../package.json");
        this.uri = Path_1.DHAPI.API_LINEBOT_PATH;
        this.helper = new ChatroomHelper_1.ChatroomHelper(connection);
        this.clientConfig = {
            channelAccessToken: this.pkgjson.linebot.channelAccessToken
        };
        this.middlewareConfig = {
            channelSecret: this.pkgjson.linebot.channelSecret
        };
    }
    static create(router) {
        let api = new LineWebhookAPI(DBHelper_1.DBHelper.connection);
        DHLog_1.DHLog.d("[" + this.name + ":create] " + api.uri);
        api.post(router);
    }
    static getSignature(body, screat) {
        let signature = crypto_1.createHmac('SHA256', screat).update(body).digest('base64');
        return signature;
    }
    isValidateSignature(req) {
        DHLog_1.DHLog.d("x-line-signature = " + req.headers["x-line-signature"]);
        DHLog_1.DHLog.d("x-line-signature = " + LineWebhookAPI.getSignature(JSON.stringify(req.body), this.middlewareConfig.channelSecret));
        return bot_sdk_1.validateSignature(JSON.stringify(req.body), this.middlewareConfig.channelSecret, req.headers["x-line-signature"].toString());
    }
    post(router) {
        router.post(this.uri, (req, res, next) => {
            if (!this.isValidateSignature(req))
                return;
            this.printRequestInfo(req);
            let event = req.body.events[0];
            if (event && event.type === "message") {
                var source = event.source;
                var chatId = this.getChatId(source);
                let client = new bot_sdk_1.Client(this.clientConfig);
                this.saveChat(client, source.userId, chatId, source.type);
                client.replyMessage(event.replyToken, {
                    type: "text",
                    text: "你好，我是聊天機器人",
                });
            }
        });
    }
    saveChat(client, userId, chatId, type) {
        var source = {
            chatId: chatId,
            userId: userId,
            type: type,
            members: []
        };
        DHLog_1.DHLog.d("chat " + JSON.stringify(source));
        switch (source.type) {
            case "room":
                {
                    client.getRoomMemberIds(source.chatId).then((ids) => {
                        ids.forEach((id) => {
                            source.members.push({ lineUserId: id });
                        });
                        DHLog_1.DHLog.d("chat " + JSON.stringify(source));
                        this.helper.add(source, (code, result) => {
                            DHLog_1.DHLog.d("add chat code:" + code);
                        });
                    });
                }
                break;
            case "group":
                {
                    client.getRoomMemberIds(source.chatId).then((ids) => {
                        ids.forEach((id) => {
                            source.members.push({ lineUserId: id });
                        });
                        this.helper.add(source, (code, result) => {
                            DHLog_1.DHLog.d("add chat code:" + code);
                        });
                    });
                }
                break;
            default:
                {
                    this.helper.add(source, (code, result) => {
                        DHLog_1.DHLog.d("add chat code:" + code);
                    });
                }
                break;
        }
    }
    getChatId(source) {
        if (source && source.type) {
            switch (source.type) {
                case "user":
                    return source.userId;
                case "room":
                    return source.roomId;
                default:
                    return source.groupId;
            }
        }
        return null;
    }
}
exports.LineWebhookAPI = LineWebhookAPI;
