import mongoose = require("mongoose");
import querystring = require("querystring");
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

export class LineWebhookAPI extends BaseAPI {
    
    private pkgjson = require("../../../package.json");
    protected uri = DHAPI.API_LINEBOT_PATH;
    protected recordUrl = DHAPI.API_LINEBOT_PUSH_RECORD_PATH;
    protected messageUrl = DHAPI.API_LINEBOT_PUSH_MESSAGE_PATH;
    private clientConfig: ClientConfig;
    private middlewareConfig: MiddlewareConfig;
    protected chatroomHelper: ChatroomHelper;
    protected recordHelper: RecordHelper;

    public static create(router: Router) {
        let api = new LineWebhookAPI(DBHelper.connection);
        DHLog.d("[" + this.name + ":create] " + api.uri);

        api.post(router);
        api.postRecord(router);
        api.posthMessage(router);
    }

    public static getSignature(body: string, screat: string): string {
        let signature = createHmac('SHA256', screat).update(body).digest('base64');
        return signature;
    }

    constructor(connection: mongoose.Connection) {
        super();
        
        this.helper = new ChatroomHelper(connection);
        this.recordHelper = new RecordHelper(connection);
        this.chatroomHelper = new ChatroomHelper(connection);

        this.clientConfig = {
            channelAccessToken: this.pkgjson.linebot.channelAccessToken
        }

        this.middlewareConfig = {
            channelSecret: this.pkgjson.linebot.channelSecret
        }
    }

    private isValidateSignature(req: Request): boolean{
        if (validateSignature(JSON.stringify(req.body), this.middlewareConfig.channelSecret, req.headers["x-line-signature"].toString())) {
            return true;
        }else {
            DHLog.d("x-line-signature = " + req.headers["x-line-signature"]);
            DHLog.d("x-line-signature = " + LineWebhookAPI.getSignature(JSON.stringify(req.body), this.middlewareConfig.channelSecret));
            return false;
        }
    }

    private saveChat(client: Client, lineUserId: string, chatId: string, type:string) {
        var source = {
            chatId: chatId,
            lineUserId: lineUserId,
            type: type
        };

        this.helper.add(source, null);
        
        client.getProfile(source.lineUserId).then((profile) => {
            DHLog.d("profile " + JSON.stringify(profile));
        }).catch((err) => {
            DHLog.d("err " + err);
        });
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

    protected post(router: Router) {
        router.post(this.uri, (req, res, next) => {
            if (!this.isValidateSignature(req)) return;
            
            let client = new Client(this.clientConfig);
            this.printRequestInfo(req);
            
            let event = req.body.events[0];
            if (event.type === "message") {
                var source = event.source;
                var chatId = this.getChatId(source);
                
                this.saveChat(client, source.userId, chatId, source.type);
            }
            res.statusCode = 200
            res.end()

            // client.replyMessage(event.replyToken, {
            //     type: "text",
            //     text: "你好，我是回覆機器人",
            // }).catch((err) => {
            //     DHLog.d("replyMessage error " + err);
            // });
            // res.end();
        });
    }

    protected posthMessage(router: Router) {
        router.post(this.messageUrl, (req, res, next) => {
            res.setHeader("Content-type", "application/json");

            if (!this.checkHeader(req)) {
                res.statusCode = 403;
                res.json(BaseRoute.createResult(null, CONNECTION_CODE.CC_AUTH_ERROR));
                res.end();
                return;
            }
            
            if (!req.body) {
                res.json(BaseRoute.createResult(null, CONNECTION_CODE.CC_REQUEST_BODY_ERROR));
                res.end();
                return;
            }

            let body = req.body;
            let lineUserId = body.lineUserId;
            let msg = body.msg;
            DHLog.d(JSON.stringify(body));

            this.chatroomHelper.list(lineUserId, (code, chats) => {
                var message: TextMessage = {
                    type: 'text',
                    text: msg
                }

                this.pushMessage(message, chats, () => {
                    res.json(BaseRoute.createResult(null, LINE_CODE.LL_SUCCESS));
                    res.end();
                });
            });
        });
    }

    protected postRecord(router: Router) {
        router.get(this.recordUrl + "/:recordId", (req, res, next) => {
            res.setHeader("Content-type", "application/json");

            if (!this.checkHeader(req)) {
                res.statusCode = 403;
                res.json(BaseRoute.createResult(null, CONNECTION_CODE.CC_AUTH_ERROR));
                res.end();
                return;
            }
            
            if (!req.params.recordId) {
                res.json(BaseRoute.createResult(null, CONNECTION_CODE.CC_PARAMETER_ERROR));
                res.end();
                return;
            }

            let recordId = req.params.recordId;
            this.recordHelper.get(recordId, (code, record) => {
                if (code != MONGODB_CODE.MC_SUCCESS) {
                    res.json(BaseRoute.createResult(null, code));
                    res.end();
                    return;
                }

                this.chatroomHelper.list(record.lineUserId, (code, chats) => {
                    let text = DHAPI.HOST_NAME + DHAPI.RECORD_PATH + "/" + querystring.escape(record.recordId) + "/" + querystring.escape(this.hashString(record.recordId));
                    
                    var message: TextMessage = {
                        type: 'text',
                        text: text
                    }
                    
                    this.pushMessage(message, chats, () => {
                        res.json(BaseRoute.createResult(null, LINE_CODE.LL_SUCCESS));
                        res.end();
                    });
                });
            });
        });
    }

    private pushMessage(message: TextMessage, chats: IChatroom[], callback?: () => void) {
        let client = new Client(this.clientConfig);
        if (chats.length == 0)  {
            if (callback) callback();
            return;
        }

        var chat = chats[0];
        DHLog.d("push " + chat.chatId);
        DHLog.d("message" + JSON.stringify(message));

        client.pushMessage(chat.chatId, message).then((value) => {
            DHLog.d("push message success " + JSON.stringify(value));
            var array = chats.splice(0, 1);
            this.pushMessage(message, chats, callback);
        }).catch((err) => {
            DHLog.d("" + err);
            var array = chats.splice(0, 1);
            this.pushMessage(message, chats, callback);
        });
                    
    }
}