"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const querystring = require("querystring");
const bot_sdk_1 = require("@line/bot-sdk");
const ResultCode_1 = require("../ResultCode");
const crypto_1 = require("crypto");
const BaseAPI_1 = require("./BaseAPI");
const BaseRoute_1 = require("./../BaseRoute");
const ChatroomHelper_1 = require("../../mongo/helper/ChatroomHelper");
const DBHelper_1 = require("../../mongo/helper/DBHelper");
const RecordHelper_1 = require("../../mongo/helper/RecordHelper");
const DHLog_1 = require("../../util/DHLog");
const DHAPI_1 = require("../../const/DHAPI");
class LineWebhookAPI extends BaseAPI_1.BaseAPI {
    constructor(connection) {
        super();
        this.pkgjson = require("../../../package.json");
        this.uri = DHAPI_1.DHAPI.API_LINEBOT_PATH;
        this.recordUrl = DHAPI_1.DHAPI.API_LINEBOT_PUSH_RECORD_PATH;
        this.helper = new ChatroomHelper_1.ChatroomHelper(connection);
        this.recordHelper = new RecordHelper_1.RecordHelper(connection);
        this.chatroomHelper = new ChatroomHelper_1.ChatroomHelper(connection);
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
        api.pushRecord(router);
    }
    static getSignature(body, screat) {
        let signature = crypto_1.createHmac('SHA256', screat).update(body).digest('base64');
        return signature;
    }
    isValidateSignature(req) {
        if (bot_sdk_1.validateSignature(JSON.stringify(req.body), this.middlewareConfig.channelSecret, req.headers["x-line-signature"].toString())) {
            return true;
        }
        else {
            DHLog_1.DHLog.d("x-line-signature = " + req.headers["x-line-signature"]);
            DHLog_1.DHLog.d("x-line-signature = " + LineWebhookAPI.getSignature(JSON.stringify(req.body), this.middlewareConfig.channelSecret));
            return false;
        }
    }
    saveChat(client, lineUserId, chatId, type) {
        var source = {
            chatId: chatId,
            lineUserId: lineUserId,
            type: type
        };
        this.helper.add(source, null);
        client.getProfile(source.lineUserId).then((profile) => {
            DHLog_1.DHLog.d("profile " + JSON.stringify(profile));
        }).catch((err) => {
            DHLog_1.DHLog.d("err " + err);
        });
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
    post(router) {
        router.post(this.uri, (req, res, next) => {
            if (!this.isValidateSignature(req))
                return;
            let client = new bot_sdk_1.Client(this.clientConfig);
            this.printRequestInfo(req);
            let event = req.body.events[0];
            if (event.type === "message") {
                var source = event.source;
                var chatId = this.getChatId(source);
                this.saveChat(client, source.userId, chatId, source.type);
            }
            client.replyMessage(event.replyToken, {
                type: "text",
                text: "你好，我是回覆機器人",
            }).catch((err) => {
                DHLog_1.DHLog.d("replyMessage error " + err);
            });
            res.end();
        });
    }
    pushRecord(router) {
        router.get(this.recordUrl + "/:recordId", (req, res, next) => {
            if (!this.checkHeader(req)) {
                res.statusCode = 403;
                res.json(BaseRoute_1.BaseRoute.createResult(null, ResultCode_1.CONNECTION_CODE.CC_AUTH_ERROR));
                return;
            }
            if (!req.params.recordId) {
                res.json(BaseRoute_1.BaseRoute.createResult(null, ResultCode_1.CONNECTION_CODE.CC_PARAMETER_ERROR));
                return;
            }
            let recordId = req.params.recordId;
            this.recordHelper.get(recordId, (code, record) => {
                if (code != ResultCode_1.MONGODB_CODE.MC_SUCCESS) {
                    res.json(BaseRoute_1.BaseRoute.createResult(null, code));
                    return;
                }
                this.chatroomHelper.list(record.lineUserId, (code, chats) => {
                    let text = "https://dhhealthplatform.herokuapp.com/record/" + querystring.escape(record.recordId) + "/" + querystring.escape(this.hashString(record.recordId));
                    var message = {
                        type: 'text',
                        text: text
                    };
                    this.pushMessage(message, chats, () => {
                        res.json(BaseRoute_1.BaseRoute.createResult(null, ResultCode_1.LINE_CODE.LL_SUCCESS));
                    });
                });
            });
        });
    }
    pushMessage(message, chats, callback) {
        let client = new bot_sdk_1.Client(this.clientConfig);
        if (chats.length == 0) {
            if (callback)
                callback();
            return;
        }
        var chat = chats[0];
        DHLog_1.DHLog.d("push " + chat.chatId);
        DHLog_1.DHLog.d("message" + JSON.stringify(message));
        client.pushMessage(chat.chatId, message).then((value) => {
            DHLog_1.DHLog.d("push message success " + JSON.stringify(value));
            var array = chats.splice(0, 1);
            this.pushMessage(message, chats, callback);
        }).catch((err) => {
            DHLog_1.DHLog.d("" + err);
            var array = chats.splice(0, 1);
            this.pushMessage(message, chats, callback);
        });
    }
}
exports.LineWebhookAPI = LineWebhookAPI;
