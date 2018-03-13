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
                DHLog.d("fullUrl " + fullUrl);
                var authUrl = fullUrl + DHAPI.API_LINELAUTH_PATH;
                authUrl =  encodeURIComponent(authUrl);
                DHLog.d("authUrl " + authUrl);
                var lineApi = LINEAPI.API_AUTH;
                var channelId = DHAPI.pkgjson.linebot.channelId;
                var channelSecret = DHAPI.pkgjson.linebot.channelSecret;

                lineApi += "?response_type=code" + "&" +
                "client_id=" + channelId + "&" +
                "redirect_uri=" + authUrl + "&" +
                "state=" + "2018031300001" + "&"
                "scope=openid%20profile";;

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