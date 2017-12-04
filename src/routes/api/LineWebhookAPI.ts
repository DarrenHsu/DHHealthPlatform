import mongoose = require("mongoose");
import { NextFunction, Request, Response, Router } from "express";
import { DHAPI } from "../../const/Path";
import { BaseAPI } from "./BaseAPI";
import { createHmac } from "crypto";
import { MiddlewareConfig,Client,middleware,JSONParseError,SignatureValidationFailed,TemplateMessage,WebhookEvent,ClientConfig,validateSignature } from "@line/bot-sdk";
import { IChatroom } from  "../../mongo/interface/IChatroom";
import { DHLog } from "../../util/DHLog";
import { ChatroomHelper } from "../../mongo/helper/ChatroomHelper";
import { DBHelper } from "../../mongo/helper/DBHelper";
import { error } from "util";

export class LineWebhookAPI extends BaseAPI {
    
    private pkgjson = require("../../../package.json");
    protected uri = DHAPI.API_LINEBOT_PATH;
    private clientConfig: ClientConfig;
    private middlewareConfig: MiddlewareConfig;

    public static create(router: Router) {
        let api = new LineWebhookAPI(DBHelper.connection);
        DHLog.d("[" + this.name + ":create] " + api.uri);

        api.post(router);
    }

    public static getSignature(body: string, screat: string): string {
        let signature = createHmac('SHA256', screat).update(body).digest('base64');
        return signature;
    }

    constructor(connection: mongoose.Connection) {
        super();
        
        this.helper = new ChatroomHelper(connection);

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

            client.replyMessage(event.replyToken, {
                type: "text",
                text: "你好，我是回覆機器人",
            }).catch((err) => {
                DHLog.d("replyMessage error " + err);
            });

            res.end();
        });
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
}