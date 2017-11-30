import { NextFunction, Request, Response, Router } from "express";
import { DHAPI } from "../../const/Path";
import { BaseAPI } from "./BaseAPI";
import { createHmac } from "crypto";
import { MiddlewareConfig,Client,middleware,JSONParseError,SignatureValidationFailed,TemplateMessage,WebhookEvent,ClientConfig, Config, validateSignature } from "@line/bot-sdk";
import { DHLog } from "../../util/DHLog";

export class LineWebhookAPI extends BaseAPI {
    
    private pkgjson = require("../../../package.json");
    protected uri = DHAPI.API_LINEBOT_PATH;
    private clientConfig: ClientConfig;
    private middlewareConfig: MiddlewareConfig;

    public static create(router: Router) {
        let api = new LineWebhookAPI();
        DHLog.d("[" + this.name + ":create] " + api.uri);

        api.post(router);
    }

    public static getSignature(body: string, screat: string): string {
        let signature = createHmac('SHA256', screat).update(body).digest('base64');
        return signature;
    }

    private isValidateSignature(req: Request): boolean{
        DHLog.d("x-line-signature = " + req.headers["x-line-signature"]);
        DHLog.d("x-line-signature = " + LineWebhookAPI.getSignature(JSON.stringify(req.body), this.middlewareConfig.channelSecret));
        return validateSignature(JSON.stringify(req.body), this.middlewareConfig.channelSecret, req.headers["x-line-signature"].toString());
    }

    constructor() {
        super();
        
        this.clientConfig = {
            channelAccessToken: this.pkgjson.linebot.channelAccessToken
        }

        this.middlewareConfig = {
            channelSecret: this.pkgjson.linebot.channelSecret
        }
    }

    protected post(router: Router) {
        router.post(this.uri, (req, res, next) => {
            if (!this.isValidateSignature(req)) return;
            
            this.printRequestInfo(req);
            
            let event = req.body.events[0];
            if (event.type === "message") {
                let client = new Client(this.clientConfig);
                client.replyMessage(event.replyToken, {
                    type: "text",
                    text: "你好，我是聊天機器人",
                });
            }
        });
    }    
}