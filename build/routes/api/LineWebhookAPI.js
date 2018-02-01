"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const querystring = require("querystring");
const bot_sdk_1 = require("@line/bot-sdk");
const ResultCode_1 = require("../ResultCode");
const crypto_1 = require("crypto");
const BaseAPI_1 = require("./BaseAPI");
const ChatroomHelper_1 = require("../../mongo/helper/ChatroomHelper");
const DBHelper_1 = require("../../mongo/helper/DBHelper");
const RecordHelper_1 = require("../../mongo/helper/RecordHelper");
const DHLog_1 = require("../../util/DHLog");
const DHAPI_1 = require("../../const/DHAPI");
class LineWebhookAPI extends BaseAPI_1.BaseAPI {
    constructor(connection) {
        super();
        this.uri = DHAPI_1.DHAPI.API_LINEBOT_PATH;
        this.pkgjson = require("../../../package.json");
        this.recordUrl = DHAPI_1.DHAPI.API_LINEBOT_PUSH_RECORD_PATH;
        this.messageUrl = DHAPI_1.DHAPI.API_LINEBOT_PUSH_MESSAGE_PATH;
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
        api.postRecord(router);
        api.posthMessage(router);
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
            DHLog_1.DHLog.ld("x-line-signature = " + req.headers["x-line-signature"]);
            DHLog_1.DHLog.ld("x-line-signature = " + LineWebhookAPI.getSignature(JSON.stringify(req.body), this.middlewareConfig.channelSecret));
            return false;
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
    saveChat(lineUserId, chatId, type) {
        var source = {
            chatId: chatId,
            lineUserId: lineUserId,
            type: type
        };
        this.helper.add(source, null);
        let client = new bot_sdk_1.Client(this.clientConfig);
        client.getProfile(source.lineUserId).then((profile) => {
            DHLog_1.DHLog.ld("profile " + JSON.stringify(profile));
        }).catch((err) => {
            DHLog_1.DHLog.ld("err " + err);
        });
    }
    post(router) {
        router.post(this.uri, (req, res, next) => {
            if (!this.isValidateSignature(req))
                return;
            this.printRequestInfo(req);
            let event = req.body.events[0];
            if (event.type === "message") {
                var source = event.source;
                var chatId = this.getChatId(source);
                this.saveChat(source.userId, chatId, source.type);
            }
            res.statusCode = 200;
            res.end();
        });
    }
    posthMessage(router) {
        router.post(this.messageUrl, (req, res, next) => {
            if (!this.checkHeader(req)) {
                this.sendAuthFaild(res);
                return;
            }
            if (!req.body) {
                this.sendBodyFaild(res);
                return;
            }
            let body = req.body;
            let lineUserId = body.lineUserId;
            let msg = body.msg;
            DHLog_1.DHLog.ld(JSON.stringify(body));
            this.chatroomHelper.list(lineUserId, (code, chats) => {
                var message = {
                    type: 'text',
                    text: msg
                };
                this.pushMessage(message, chats, () => {
                    this.sendSuccess(res, ResultCode_1.LINE_CODE.LL_SUCCESS);
                });
            });
        });
    }
    postRecord(router) {
        router.get(this.recordUrl + "/:recordId", (req, res, next) => {
            if (!this.checkHeader(req)) {
                this.sendAuthFaild(res);
                return;
            }
            if (!req.params.recordId) {
                this.sendParamsFaild(res);
                return;
            }
            let recordId = req.params.recordId;
            this.recordHelper.get(recordId, (code, record) => {
                if (code != ResultCode_1.MONGODB_CODE.MC_SUCCESS) {
                    this.sendFaild(res, code);
                    return;
                }
                this.chatroomHelper.list(record.lineUserId, (code, chats) => {
                    let text = DHAPI_1.DHAPI.HOST_NAME + DHAPI_1.DHAPI.RECORD_PATH + "/" + querystring.escape(record.recordId) + "/" + querystring.escape(this.hashString(record.recordId));
                    var message = {
                        type: 'text',
                        text: text
                    };
                    this.pushMessage(message, chats, () => {
                        this.sendSuccess(res, code);
                    });
                });
            });
        });
    }
    /* send message proces */
    replyMessageWithToken(token) {
        let client = new bot_sdk_1.Client(this.clientConfig);
        client.replyMessage(token, {
            type: "text",
            text: "你好，我是回覆機器人",
        }).catch((err) => {
            DHLog_1.DHLog.ld("replyMessage error " + err);
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
        DHLog_1.DHLog.ld("push " + chat.chatId);
        DHLog_1.DHLog.ld("message" + JSON.stringify(message));
        client.pushMessage(chat.chatId, message).then((value) => {
            DHLog_1.DHLog.ld("push message success " + JSON.stringify(value));
            var array = chats.splice(0, 1);
            this.pushMessage(message, chats, callback);
        }).catch((err) => {
            DHLog_1.DHLog.ld("" + err);
            var array = chats.splice(0, 1);
            this.pushMessage(message, chats, callback);
        });
    }
}
exports.LineWebhookAPI = LineWebhookAPI;
