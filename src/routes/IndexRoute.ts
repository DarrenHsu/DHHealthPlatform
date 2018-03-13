import os = require("os");
import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "./BaseRoute";
import { DHAPI } from "../const/DHAPI";
import { DHLog } from "../util/DHLog";

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
                var hostname = os.hostname;
                var host = req.host
                DHLog.d("hostname " + hostname);
                DHLog.d("host " + host);
                return res.redirect(DHAPI.LOGIN_INPUT_PATH);
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