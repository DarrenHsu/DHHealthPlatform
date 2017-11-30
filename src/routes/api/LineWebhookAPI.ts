import { NextFunction, Request, Response, Router } from "express";
import { DHAPI } from "../../const/Path";
import { BaseAPI } from "./BaseAPI";
import { createHmac } from "crypto";
import { MiddlewareConfig,Client,middleware,JSONParseError,SignatureValidationFailed,TemplateMessage,WebhookEvent,ClientConfig, Config } from "@line/bot-sdk";

export class LineWebhookAPI extends BaseAPI {
    
    private pkgjson = require("../../../package.json");
    protected uri = DHAPI.API_LINEBOT_PATH;
    private clientConfig: ClientConfig;
    private middlewareConfig: MiddlewareConfig;
    
    public static create(router: Router) {
        let api = new LineWebhookAPI();
        console.log("[LineWebhookAPI::create] Creating LineWebhookAPI route " + api.uri);
        api.get(router);
        api.post(router);
    }

    constructor() {
        super();
        
        console.log("LINE Chanel Id: " + this.pkgjson.linebot.channelId);
        console.log("LINE Chanel Secret: " + this.pkgjson.linebot.channelSecret);
        console.log("LINE Chanel Access Token: " + this.pkgjson.linebot.channelAccessToken);

        this.clientConfig = {
            channelAccessToken: this.pkgjson.linebot.channelAccessToken
        }

        this.middlewareConfig = {
            channelSecret: this.pkgjson.linebot.channelSecret
        }
    }

    protected post(router: Router) {
        console.log("LINE Chanel Secret: " + this.middlewareConfig.channelSecret);
        console.log("LINE Chanel Access Token: " + this.clientConfig.channelAccessToken);

        router.post(this.uri, (req, res, next) => {
            console.log("post !");
            console.log("header:" + JSON.stringify(req.headers));
            console.log("body:" + JSON.stringify(req.body))

            let event = req.body.events[0];
            if (event.type === "message") {
                let client = new Client(this.clientConfig);
                client.replyMessage(event.replyToken, {
                    type: "text",
                    text: "你好我是聊天機器人",
                });
            }
        });
    }
    
    protected get(router: Router) {
        router.get(this.uri, (req, res, next) => {
            console.log("get !");
            console.log("header:" + JSON.stringify(req.headers));
            console.log("body:" + JSON.stringify(req.body));
            res.end();
        });
    }
}