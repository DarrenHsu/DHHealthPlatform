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
            if (req.session.account && req.session.name && req.session.picture) {
                isLogin = true;
            }
            
            if (isLogin) {
                new IndexRoute().index(req, res, next);
            }else {
                return res.redirect(DHAPI.LOGIN_PROCESS_PATH);
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
            "name": req.session.name,
            "picture": req.session.picture, 
            "loginTime": req.session.time
        };
        this.render(req, res, "index", options);
    }
}