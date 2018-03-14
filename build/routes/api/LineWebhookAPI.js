"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const querystring = require("querystring");
const request = require("request");
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
const LINEAPI_1 = require("../../const/LINEAPI");
class LineWebhookAPI extends BaseAPI_1.BaseAPI {
    constructor(connection) {
        super();
        this.uri = LINEAPI_1.LINEAPI.API_LINEBOT_PATH;
        this.recordUrl = LINEAPI_1.LINEAPI.API_LINEBOT_PUSH_RECORD_PATH;
        this.messageUrl = LINEAPI_1.LINEAPI.API_LINEBOT_PUSH_MESSAGE_PATH;
        this.authorizationUrl = LINEAPI_1.LINEAPI.API_LINE_AUTH_PATH;
        this.accessTokenUrl = LINEAPI_1.LINEAPI.API_LINE_TOKEN_PATH;
        this.helper = new ChatroomHelper_1.ChatroomHelper(connection);
        this.recordHelper = new RecordHelper_1.RecordHelper(connection);
        this.chatroomHelper = new ChatroomHelper_1.ChatroomHelper(connection);
        this.clientConfig = {
            channelAccessToken: DHAPI_1.DHAPI.pkgjson.linebot.channelAccessToken
        };
        this.middlewareConfig = {
            channelSecret: DHAPI_1.DHAPI.pkgjson.linebot.channelSecret
        };
    }
    static create(router) {
        let api = new LineWebhookAPI(DBHelper_1.DBHelper.connection);
        DHLog_1.DHLog.d("[" + this.name + ":create] " + api.uri);
        api.post(router);
        api.postRecord(router);
        api.posthMessage(router);
        api.getAuthorization(router);
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
    /*
    * @description 取得line web login 授權
    */
    getAuthorization(router) {
        router.get(this.authorizationUrl, (req, res, next) => {
            DHLog_1.DHLog.ld("Get Authorization");
            var error = req.query.error;
            var error_description = req.query.error_description;
            if (error) {
                DHLog_1.DHLog.ld("error " + error);
                DHLog_1.DHLog.ld("error " + error_description);
                res.end();
                return;
            }
            var state = req.query.state;
            var code = req.query.code;
            if (state && code) {
                DHLog_1.DHLog.ld("state " + state);
                DHLog_1.DHLog.ld("code " + code);
                res.end();
            }
            else {
                res.end();
                return;
            }
            var fullUrl = BaseRoute_1.BaseRoute.getFullHostUrl(req);
            var authUrl = fullUrl + LINEAPI_1.LINEAPI.API_LINE_AUTH_PATH;
            var channelId = DHAPI_1.DHAPI.pkgjson.linelogin.channelId;
            var channelSecret = DHAPI_1.DHAPI.pkgjson.linelogin.channelSecret;
            /* Get Access Token */
            var option = {
                form: {
                    "grant_type": "authorization_code",
                    "code": code,
                    "redirect_uri": authUrl,
                    "client_id": channelId,
                    "client_secret": channelSecret
                },
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            };
            DHLog_1.DHLog.ld("call Get Access Token " + LINEAPI_1.LINEAPI.API_ACCESS_TOKEN);
            DHLog_1.DHLog.ld("option " + JSON.stringify(option));
            request.post(LINEAPI_1.LINEAPI.API_ACCESS_TOKEN, option, (error, response, body) => {
                if (error) {
                    DHLog_1.DHLog.ld("callback error " + error);
                }
                else {
                    DHLog_1.DHLog.ld("callback success " + body);
                    DHLog_1.DHLog.ld("header alg " + res.header("alg"));
                }
                res.end();
            });
        });
    }
    /*
    * @description 取得line message 回呼程式
    */
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
    /*
    * @description 發送line message
    */
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
    /*
    * @description 發送紀錄至line
    */
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
                    let text = BaseRoute_1.BaseRoute.getFullHostUrl(req) + "/" + DHAPI_1.DHAPI.RECORD_PATH + "/" + querystring.escape(record.recordId) + "/" + querystring.escape(this.hashString(record.recordId));
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
    /*
    * @description 回覆訊息處理
    */
    replyMessageWithToken(token) {
        let client = new bot_sdk_1.Client(this.clientConfig);
        client.replyMessage(token, {
            type: "text",
            text: "你好，我是回覆機器人",
        }).catch((err) => {
            DHLog_1.DHLog.ld("replyMessage error " + err);
        });
    }
}
exports.LineWebhookAPI = LineWebhookAPI;
