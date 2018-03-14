import mongoose = require("mongoose");
import querystring = require("querystring");
import * as request from "request";
import { MiddlewareConfig, Client, middleware, JSONParseError, SignatureValidationFailed, TemplateMessage, WebhookEvent, ClientConfig, validateSignature, TextMessage } from "@line/bot-sdk";
import { CONNECTION_CODE, MONGODB_CODE, ResultCodeMsg, LINE_CODE } from "../ResultCode";
import { NextFunction, Request, Response, Router } from "express";
import { createHmac } from "crypto";
import { BaseAPI } from "./BaseAPI";
import { BaseRoute } from "./../BaseRoute";
import { IChatroom } from  "../../mongo/interface/IChatroom";
import { ChatroomHelper } from "../../mongo/helper/ChatroomHelper";
import { DBHelper } from "../../mongo/helper/DBHelper";
import { RecordHelper } from "../../mongo/helper/RecordHelper";
import { error, print } from "util";
import { DHLog } from "../../util/DHLog";
import { DHAPI } from "../../const/DHAPI";
import { IRecord } from "../../mongo/interface/IRecord";
import { LINEAPI } from "../../const/LINEAPI";

export class LineWebhookAPI extends BaseAPI {
    
    protected uri = LINEAPI.API_LINEBOT_PATH;
    private recordUrl = LINEAPI.API_LINEBOT_PUSH_RECORD_PATH;
    private messageUrl = LINEAPI.API_LINEBOT_PUSH_MESSAGE_PATH;
    private authorizationUrl = LINEAPI.API_LINE_AUTH_PATH;
    private accessTokenUrl = LINEAPI.API_LINE_TOKEN_PATH;

    private clientConfig: ClientConfig;
    private middlewareConfig: MiddlewareConfig;

    private chatroomHelper: ChatroomHelper;
    private recordHelper: RecordHelper;

    public static create(router: Router) {
        let api = new LineWebhookAPI(DBHelper.connection);
        DHLog.d("[" + this.name + ":create] " + api.uri);
        
        api.post(router);
        api.postRecord(router);
        api.posthMessage(router);
        api.getAuthorization(router);
    }

    private static getSignature(body: string, screat: string): string {
        let signature = createHmac('SHA256', screat).update(body).digest('base64');
        return signature;
    }

    constructor(connection: mongoose.Connection) {
        super();
        
        this.helper = new ChatroomHelper(connection);
        this.recordHelper = new RecordHelper(connection);
        this.chatroomHelper = new ChatroomHelper(connection);

        this.clientConfig = {
            channelAccessToken: DHAPI.pkgjson.linebot.channelAccessToken
        }

        this.middlewareConfig = {
            channelSecret: DHAPI.pkgjson.linebot.channelSecret
        }
    }

    private isValidateSignature(req: Request): boolean{
        if (validateSignature(JSON.stringify(req.body), this.middlewareConfig.channelSecret, req.headers["x-line-signature"].toString())) {
            return true;
        }else {
            DHLog.ld("x-line-signature = " + req.headers["x-line-signature"]);
            DHLog.ld("x-line-signature = " + LineWebhookAPI.getSignature(JSON.stringify(req.body), this.middlewareConfig.channelSecret));
            return false;
        }
    }

    private getChatId(source: any): string {
        if (source && source.type) {
            switch(source.type) {
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
    
    private saveChat(lineUserId: string, chatId: string, type:string) {
        var source = {
            chatId: chatId,
            lineUserId: lineUserId,
            type: type
        };

        this.helper.add(source, null);
        
        let client = new Client(this.clientConfig);
        client.getProfile(source.lineUserId).then((profile) => {
            DHLog.ld("profile " + JSON.stringify(profile));
        }).catch((err) => {
            DHLog.ld("err " + err);
        });
    }

    private pushMessage(message: TextMessage, chats: IChatroom[], callback?: () => void) {
        let client = new Client(this.clientConfig);
        if (chats.length == 0)  {
            if (callback) callback();
            return;
        }

        var chat = chats[0];
        DHLog.ld("push " + chat.chatId);
        DHLog.ld("message" + JSON.stringify(message));

        client.pushMessage(chat.chatId, message).then((value) => {
            DHLog.ld("push message success " + JSON.stringify(value));
            var array = chats.splice(0, 1);
            this.pushMessage(message, chats, callback);
        }).catch((err) => {
            DHLog.ld("" + err);
            var array = chats.splice(0, 1);
            this.pushMessage(message, chats, callback);
        });
    }

    /*
    * @description 取得line web login 授權
    */
    protected getAuthorization(router: Router) {
        router.get(this.authorizationUrl, (req, res, next) => {
            DHLog.ld("Get Authorization");
            var error = req.query.error;
            var error_description = req.query.error_description;
            if (error) {
                DHLog.ld("error " + error);
                DHLog.ld("error " + error_description);
                res.end();
                return;
            }

            var state = req.query.state;
            var code = req.query.code;
            if (state && code) {
                DHLog.ld("state " + state);
                DHLog.ld("code " + code);
                res.end();
            }else {
                res.end();
                return;
            }

            var fullUrl = BaseRoute.getFullHostUrl(req);
            var authUrl = fullUrl + LINEAPI.API_LINE_AUTH_PATH;
            var channelId = DHAPI.pkgjson.linelogin.channelId;
            var channelSecret = DHAPI.pkgjson.linelogin.channelSecret;

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

            DHLog.ld("call Get Access Token " + LINEAPI.API_ACCESS_TOKEN);
            DHLog.ld("option " + JSON.stringify(option));

            request.post(LINEAPI.API_ACCESS_TOKEN, option, (error, response, body) => {
                if (error) {
                    DHLog.ld("callback error " + error);
                }else {
                    DHLog.ld("callback success " + body);
                    DHLog.ld("header alg " + res.header("alg"));
                }
                
                res.end();
            });
        });
    }

    /*
    * @description 取得line message 回呼程式
    */
    protected post(router: Router) {
        router.post(this.uri, (req, res, next) => {
            if (!this.isValidateSignature(req)) return;
            
            this.printRequestInfo(req);
            
            let event = req.body.events[0];
            if (event.type === "message") {
                var source = event.source;
                var chatId = this.getChatId(source);
                
                this.saveChat(source.userId, chatId, source.type);
            }
            res.statusCode = 200
            res.end()
        });
    }

    /*
    * @description 發送line message 
    */
    protected posthMessage(router: Router) {
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
            DHLog.ld(JSON.stringify(body));

            this.chatroomHelper.list(lineUserId, (code, chats) => {
                var message: TextMessage = {
                    type: 'text',
                    text: msg
                }

                this.pushMessage(message, chats, () => {
                    this.sendSuccess(res, LINE_CODE.LL_SUCCESS);
                });
            });
        });
    }

    /*
    * @description 發送紀錄至line
    */
    protected postRecord(router: Router) {
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
                if (code != MONGODB_CODE.MC_SUCCESS) {
                    this.sendFaild(res, code);
                    return;
                }

                this.chatroomHelper.list(record.lineUserId, (code, chats) => {
                    let text = BaseRoute.getFullHostUrl(req) + "/" + DHAPI.RECORD_PATH + "/" + querystring.escape(record.recordId) + "/" + querystring.escape(this.hashString(record.recordId));
                    
                    var message: TextMessage = {
                        type: 'text',
                        text: text
                    }
                    
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
    private replyMessageWithToken(token: string) {
        let client = new Client(this.clientConfig);
        client.replyMessage(token, {
            type: "text",
            text: "你好，我是回覆機器人",
        }).catch((err) => {
            DHLog.ld("replyMessage error " + err);
        });
    }
}