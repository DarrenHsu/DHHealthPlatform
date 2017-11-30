import { NextFunction, Request, Response, Router } from "express";
import { DHAPI } from "../../const/Path";
import { BaseAPI } from "./BaseAPI";
import { createHmac } from "crypto";
import { Client,middleware,JSONParseError,SignatureValidationFailed,TemplateMessage,WebhookEvent,ClientConfig } from "@line/bot-sdk";

export class LineWebhookAPI extends BaseAPI {
    
    private pkgjson = require("../../../package.json");
    protected uri = DHAPI.API_LINEBOT_PATH;
    private client: Client;
    
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

        var config = {
            channelSecret: this.pkgjson.linebot.channelSecret,
            channelAccessToken: this.pkgjson.linebot.channelAccessToken
        }

        this.client = new Client(config);
    }

    protected post(router: Router) {
        router.post(this.uri, (req, res, next) => {
            console.log("post !");
        });
    }
    
    protected get(router: Router) {
        router.get(this.uri, (req, res, next) => {
            console.log("get !");
        });
    }
}