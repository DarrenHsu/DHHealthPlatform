import { NextFunction, Request, Response, Router } from "express";
import { DHAPI } from "../../const/Path";
import { BaseAPI } from "./BaseAPI";
import { createHmac } from "crypto";

export class LineWebhookAPI extends BaseAPI {
    
    private pkgjson = require("../../../package.json");
    protected uri = DHAPI.API_LINEBOT_PATH;

    public static create(router: Router) {
        let api = new LineWebhookAPI();
        console.log("[LineWebhookAPI::create] Creating LineWebhookAPI route " + api.uri);
        api.post(router);
    }

    constructor() {
        super();
        var body = {
            "message": "tjos is a test"
        };
        console.log("LINE Chanel Id: " + this.pkgjson.linebot.channelId);
        console.log("LINE Chanel Secret: " + this.pkgjson.linebot.channelSecret);
        console.log("LINE Chanel Access Token: " + this.pkgjson.linebot.channelAccessToken);

        var digest = createHmac("SHA256", this.pkgjson.linebot.channelSecret).update(JSON.stringify(body)).digest("base64");
        console.log("digest " + digest);
    }

    protected post(router: Router) {

    }
}