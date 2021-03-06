"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const querystring = require("querystring");
const JwtDecode = require("jwt-decode");
const qs = require("qs");
const axios_1 = require("axios");
const bot_sdk_1 = require("@line/bot-sdk");
const crypto_1 = require("crypto");
const ResultCode_1 = require("../ResultCode");
const DHLog_1 = require("../../util/DHLog");
const DHAPI_1 = require("../../const/DHAPI");
const LINEAPI_1 = require("../../const/LINEAPI");
const BaseRoute_1 = require("../BaseRoute");
const BaseAPI_1 = require("./BaseAPI");
const DBHelper_1 = require("../../mongo/helper/DBHelper");
const ChatroomHelper_1 = require("../../mongo/helper/ChatroomHelper");
const UserHelper_1 = require("../../mongo/helper/UserHelper");
const RecordHelper_1 = require("../../mongo/helper/RecordHelper");
const ProfileHelper_1 = require("../../mongo/helper/ProfileHelper");
/**
 * @description LINE 機器人相關 api
 */
class LineWebhookAPI extends BaseAPI_1.BaseAPI {
    constructor(connection) {
        super();
        this.uri = LINEAPI_1.LINEAPI.API_LINEBOT_PATH;
        this.helper = new ChatroomHelper_1.ChatroomHelper(connection);
        this.recordHelper = new RecordHelper_1.RecordHelper(connection);
        this.chatroomHelper = new ChatroomHelper_1.ChatroomHelper(connection);
        this.userHelper = new UserHelper_1.UserHelper(connection);
        this.profileHelper = new ProfileHelper_1.ProfileHelper(connection);
        this.clientConfig = {
            channelAccessToken: DHAPI_1.DHAPI.pkgjson.linebot.channelAccessToken
        };
        this.middlewareConfig = {
            channelSecret: DHAPI_1.DHAPI.pkgjson.linebot.channelSecret
        };
    }
    static create(router) {
        let api = new LineWebhookAPI(DBHelper_1.DBHelper.connection);
        DHLog_1.DHLog.d('[' + this.name + ':create] ' + api.uri);
        api.post(router);
        api.postRecord(router);
        api.posthMessage(router);
        api.postTemplete(router);
        api.posthFlex(router);
        api.getAuthorization(router);
    }
    /**
     * @description 取得 line Signature
     * @param body
     * @param screat
     */
    static getSignature(body, screat) {
        let signature = crypto_1.createHmac('SHA256', screat).update(body).digest('base64');
        return signature;
    }
    /**
     * @description 驗證line Signature機制
     * @param req
     */
    isValidateSignature(req) {
        if (bot_sdk_1.validateSignature(JSON.stringify(req.body), this.middlewareConfig.channelSecret, req.headers['x-line-signature'].toString())) {
            return true;
        }
        else {
            DHLog_1.DHLog.ld('x-line-signature = ' + req.headers['x-line-signature']);
            DHLog_1.DHLog.ld('x-line-signature = ' + LineWebhookAPI.getSignature(JSON.stringify(req.body), this.middlewareConfig.channelSecret));
            return false;
        }
    }
    /**
     * @description 取得 chat 類型id
     * @param source
     */
    getChatId(source) {
        if (source && source.type) {
            switch (source.type) {
                case 'user':
                    return source.userId;
                case 'room':
                    return source.roomId;
                default:
                    return source.groupId;
            }
        }
        return null;
    }
    /**
     * @description 儲存 chat 相關資訊
     * @param lineUserId
     * @param chatId
     * @param type
     */
    saveChat(lineUserId, chatId, type) {
        var source = {
            chatId: chatId,
            lineUserId: lineUserId,
            type: type
        };
        DHLog_1.DHLog.ld("lineUserId " + lineUserId + ",chatId " + chatId + " ,type " + type);
        this.helper.add(source, null);
        let client = new bot_sdk_1.Client(this.clientConfig);
        switch (type) {
            case "user":
                client.getProfile(source.lineUserId).then((profile) => {
                    DHLog_1.DHLog.ld('user profile ' + JSON.stringify(profile));
                    this.profileHelper.add({ lineUserId: profile.userId, pictureUrl: profile.pictureUrl, displayName: profile.displayName }, null);
                }).catch((err) => {
                    DHLog_1.DHLog.ld('user profile error ' + err);
                });
                break;
            case "room":
                client.getRoomMemberProfile(chatId, lineUserId).then((profile) => {
                    DHLog_1.DHLog.ld('room profile ' + JSON.stringify(profile));
                    this.profileHelper.add({ lineUserId: profile.userId, pictureUrl: profile.pictureUrl, displayName: profile.displayName }, null);
                }).catch((err) => {
                    DHLog_1.DHLog.ld('room profile error ' + err);
                });
                break;
            default:
                client.getGroupMemberProfile(chatId, lineUserId).then((profile) => {
                    DHLog_1.DHLog.ld('group profile ' + JSON.stringify(profile));
                    this.profileHelper.add({ lineUserId: profile.userId, pictureUrl: profile.pictureUrl, displayName: profile.displayName }, null);
                }).catch((err) => {
                    DHLog_1.DHLog.ld('group profile error ' + err);
                });
                break;
        }
    }
    /**
     * @description 取得line web login 授權
     * @param router
     */
    getAuthorization(router) {
        router.get(LINEAPI_1.LINEAPI.API_LINE_AUTH_PATH, (req, res, next) => {
            DHLog_1.DHLog.ld('step 1 Get Authorization start');
            var error = req.query.error;
            var error_description = req.query.error_description;
            if (error) {
                DHLog_1.DHLog.ld('error ' + error);
                DHLog_1.DHLog.ld('error ' + error_description);
                return res.redirect(DHAPI_1.DHAPI.ERROR_PATH + '/' + ResultCode_1.LINE_CODE.LL_LOGIN_ERROR);
            }
            var state = req.query.state;
            var code = req.query.code;
            if (!code)
                return res.redirect(DHAPI_1.DHAPI.ERROR_PATH + '/' + ResultCode_1.LINE_CODE.LL_LOGIN_ERROR);
            var fullUrl = BaseRoute_1.BaseRoute.getFullHostUrl(req);
            var authUrl = fullUrl + LINEAPI_1.LINEAPI.API_LINE_AUTH_PATH;
            var channelId = DHAPI_1.DHAPI.pkgjson.linelogin.channelId;
            var channelSecret = DHAPI_1.DHAPI.pkgjson.linelogin.channelSecret;
            /* Get Access Token */
            var bodyFormData = qs.stringify({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: authUrl,
                client_id: channelId,
                client_secret: channelSecret
            });
            DHLog_1.DHLog.ld('body ' + bodyFormData);
            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };
            DHLog_1.DHLog.ld('step 2 Get accesstoken start ' + JSON.stringify(config));
            axios_1.default.post(LINEAPI_1.LINEAPI.API_ACCESS_TOKEN, bodyFormData, config).then((response) => {
                DHLog_1.DHLog.ld('response $(respons.data)');
                var json = response.data;
                if (!json.id_token)
                    return res.redirect(DHAPI_1.DHAPI.ERROR_PATH + '/' + ResultCode_1.LINE_CODE.LL_LOGIN_ERROR);
                let jwt = JwtDecode(json.id_token);
                var sub = jwt['sub'];
                var name = jwt['name'];
                var picture = jwt['picture'];
                if (!sub || !name || !picture)
                    return res.redirect(DHAPI_1.DHAPI.ERROR_PATH + '/' + ResultCode_1.LINE_CODE.LL_LOGIN_ERROR);
                DHLog_1.DHLog.ld('step 3  callback and check user ' + sub);
                this.userHelper.find(sub, (code, result) => {
                    if (code == ResultCode_1.MONGODB_CODE.MC_SUCCESS) {
                        DHLog_1.DHLog.ld('step 4  result ' + sub);
                        if (req.session.account) {
                            req.session.time++;
                        }
                        else {
                            req.session.account = sub;
                            req.session.name = name;
                            req.session.picture = picture;
                            req.session.time = 1;
                        }
                        return res.redirect(DHAPI_1.DHAPI.ROOT_PATH);
                    }
                    else {
                        return res.redirect(DHAPI_1.DHAPI.ERROR_PATH + '/' + ResultCode_1.LINE_CODE.LL_MOB_PROFILE_NOT_FOUND_ERROR);
                    }
                });
            }).catch((error) => {
                DHLog_1.DHLog.ld('error ' + error);
                return res.redirect(DHAPI_1.DHAPI.ERROR_PATH + '/' + ResultCode_1.LINE_CODE.LL_LOGIN_ERROR);
            });
        });
    }
    /**
     * @description 取得line message 回呼程式
     * @param router
     */
    post(router) {
        router.post(this.uri, (req, res, next) => {
            if (!this.isValidateSignature(req))
                return;
            this.printRequestInfo(req);
            let event = req.body.events[0];
            if (event.type === 'message') {
                var source = event.source;
                var chatId = this.getChatId(source);
                this.saveChat(source.userId, chatId, source.type);
            }
            res.statusCode = 200;
            res.end();
        });
    }
    /**
     * @description 發送紀錄至line
     * @param router
     */
    postRecord(router) {
        router.get(LINEAPI_1.LINEAPI.API_LINEBOT_PUSH_RECORD_PATH + '/:recordId', (req, res, next) => {
            if (!this.checkHeaderAndSend(req, res))
                return;
            if (!req.params.recordId)
                return this.sendParamsFaild(res);
            let recordId = req.params.recordId;
            this.recordHelper.findOne(recordId, (code, record) => {
                if (code != ResultCode_1.MONGODB_CODE.MC_SUCCESS)
                    return this.sendFaild(res, code);
                this.userHelper.find(record.lineUserId, (code, users) => {
                    let user = users[0];
                    this.chatroomHelper.find(record.lineUserId, (code, chats) => {
                        let recordUri = BaseRoute_1.BaseRoute.getFullHostUrl(req) + DHAPI_1.DHAPI.RECORD_PREVIEW_PATH + '/' + querystring.escape(record.recordId) + '/' + querystring.escape(this.hashString(record.recordId));
                        let title = '以下為「' + user.name + '」的運動記錄';
                        var message = {
                            type: 'template',
                            altText: title,
                            template: {
                                type: 'buttons',
                                thumbnailImageUrl: BaseRoute_1.BaseRoute.getFullHostUrl(req) + '/images/sport.jpeg',
                                title: title,
                                text: '請給他一個讚哦',
                                actions: [
                                    {
                                        type: 'uri',
                                        label: '詳細內容',
                                        uri: recordUri
                                    },
                                    {
                                        type: 'postback',
                                        label: '讚',
                                        data: 'action=ok&itemid=123'
                                    }
                                ]
                            }
                        };
                        this.pushMessage(message, chats, () => {
                            this.sendSuccess(res, ResultCode_1.LINE_CODE.LL_SUCCESS);
                        });
                    });
                });
            });
        });
    }
    /**
     * @description 發送紀錄至line
     * @param router
     */
    posthFlex(router) {
        router.post(LINEAPI_1.LINEAPI.API_LINEBOT_PUSH_FLEX_PATH, (req, res, next) => {
            if (!this.checkHeaderAndSend(req, res))
                return;
            if (!this.checkBodyAndSend(req, res))
                return;
            let body = req.body;
            var message = {
                type: 'flex',
                altText: body.altText,
                contents: body.contents
            };
            this.chatroomHelper.find(body.lineUserId, (code, chats) => {
                this.pushMessage(message, chats, () => {
                    this.sendSuccess(res, ResultCode_1.LINE_CODE.LL_SUCCESS);
                });
            });
        });
    }
    /**
     * @description 發送line templete
     * @param router
     */
    postTemplete(router) {
        router.post(LINEAPI_1.LINEAPI.API_LINEBOT_PUSH_TEMPLETE_PATH, (req, res, next) => {
            if (!this.checkHeaderAndSend(req, res))
                return;
            if (!this.checkBodyAndSend(req, res))
                return;
            let body = req.body;
            var message = {
                type: 'template',
                altText: body.altText,
                template: body.template
            };
            this.chatroomHelper.find(body.lineUserId, (code, chats) => {
                this.pushMessage(message, chats, () => {
                    this.sendSuccess(res, ResultCode_1.LINE_CODE.LL_SUCCESS);
                });
            });
        });
    }
    /**
     * @description 發送line message
     * @param router
     */
    posthMessage(router) {
        router.post(LINEAPI_1.LINEAPI.API_LINEBOT_PUSH_MESSAGE_PATH, (req, res, next) => {
            if (!this.checkHeaderAndSend(req, res))
                return;
            if (!this.checkBodyAndSend(req, res))
                return;
            let body = req.body;
            var message = {
                type: 'text',
                text: body.text
            };
            this.chatroomHelper.find(body.lineUserId, (code, chats) => {
                this.pushMessage(message, chats, () => {
                    this.sendSuccess(res, ResultCode_1.LINE_CODE.LL_SUCCESS);
                });
            });
        });
    }
    /**
     * @description 內部呼叫發送機制
     * @param message
     * @param chats
     * @param callback
     */
    pushMessage(message, chats, callback) {
        let client = new bot_sdk_1.Client(this.clientConfig);
        if (chats.length == 0) {
            if (callback)
                callback();
            return;
        }
        var chat = chats[0];
        DHLog_1.DHLog.ld('push ' + chat.chatId);
        DHLog_1.DHLog.ld('msg ' + JSON.stringify(message));
        client.pushMessage(chat.chatId, message).then((value) => {
            DHLog_1.DHLog.ld('push message success ' + JSON.stringify(value));
            chats.shift();
            this.pushMessage(message, chats, callback);
        }).catch((err) => {
            DHLog_1.DHLog.ld('push message error ' + err);
            chats.shift();
            this.pushMessage(message, chats, callback);
        });
    }
    /**
     * @description 回覆訊息處理
     * @param token 回覆訊息的token
     */
    replyMessageWithToken(token) {
        let client = new bot_sdk_1.Client(this.clientConfig);
        client.replyMessage(token, {
            type: 'text',
            text: '你好，我是回覆機器人',
        }).catch((err) => {
            DHLog_1.DHLog.ld('replyMessage error ' + err);
        });
    }
}
exports.LineWebhookAPI = LineWebhookAPI;
