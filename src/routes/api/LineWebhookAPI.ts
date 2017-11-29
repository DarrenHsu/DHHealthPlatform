import { NextFunction, Request, Response, Router } from "express";
import { BaseAPI } from "./BaseAPI";

export class LineWebhookAPI extends BaseAPI {
    
    private pkgjson = require("../../package.json");
    
    public static create(router: Router) {
        let api = new LineWebhookAPI();
        console.log("[RecordAPI::create] Creating RecordAPI route " + api.uri);
        api.post(router);
    }

    constructor() {
        super();
    }

    protected post(router: Router) {

    }
}