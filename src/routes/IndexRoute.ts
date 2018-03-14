import os = require("os");
import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "./BaseRoute";
import { DHAPI } from "../const/DHAPI";
import { LINEAPI } from "../const/LINEAPI";
import { DHLog } from "../util/DHLog";
import { LoginRoute } from "./LoginRoute";

export class IndexRoute extends BaseRoute {
    
    public static create(router: Router) {
        DHLog.d("[" + this.name + ":create] " + DHAPI.ROOT_PATH);
        router.get(DHAPI.ROOT_PATH, (req: Request, res: Response, next: NextFunction) => {
            var isLogin = false;
            if (req.session.account) {
                isLogin = true;
            }
            
            if (isLogin) {
                new IndexRoute().index(req, res, next);
            }else {
                var fullUrl = this.getFullHostUrl(req);
                var authUrl = encodeURIComponent(fullUrl + LINEAPI.API_LINE_AUTH_PATH);
                var channelId = DHAPI.pkgjson.linelogin.channelId;
                var channelSecret = DHAPI.pkgjson.linelogin.channelSecret;
                var lineApi = LINEAPI.API_LINE_AUTH_PATH + "?" +
                    "response_type=code" + "&" +
                    "client_id=" + channelId + "&" +
                    "redirect_uri=" + authUrl + "&" +
                    "state=" + "2018031300001" + "&" +
                    "scope=openid%20profile%20email";

                DHLog.d("lineApi " + lineApi);
                
                return res.redirect(lineApi);
            }
        });
    }

    constructor() {
        super();
    }

    public index(req: Request, res: Response, next: NextFunction) {
        this.title = "Home | DHHealthPlatform | index";
        let options: Object = {
            "message": "Welcome to the Index",
            "account": req.session.account,
            "loginTime": req.session.time
        };
        this.render(req, res, "index", options);
    }
}