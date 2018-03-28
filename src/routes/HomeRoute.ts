import os = require("os");
import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "./BaseRoute";
import { DHAPI } from "../const/DHAPI";
import { LINEAPI } from "../const/LINEAPI";
import { DHLog } from "../util/DHLog";

export class HomeRoute extends BaseRoute {
    
    constructor() {
        super();
    }

    public static create(router: Router) {
        DHLog.d("[" + this.name + ":create] " + DHAPI.ROOT_PATH);
        router.get(DHAPI.ROOT_PATH, (req: Request, res: Response, next: NextFunction) => {
            if (!this.checkLogin(req, res, next)) {
                return;
            }
            
            new HomeRoute().loginIndex(req, res, next);
        });

        DHLog.d("[" + this.name + ":create] " + DHAPI.HOME_PATH);
        router.get(DHAPI.HOME_PATH, (req: Request, res: Response, next: NextFunction) => {
            new HomeRoute().index(req, res, next);
        });
    }

    public index(req: Request, res: Response, next: NextFunction) {
        this.title = BaseRoute.AP_TITLE;
        let options: Object = {
            auth: {
                path: DHAPI.HOME_PATH,
                checkLogin: true
            },
            name: req.session.name,
        };
        this.render(req, res, "home/index", options);
    }

    public loginIndex(req: Request, res: Response, next: NextFunction) {
        this.title = BaseRoute.AP_TITLE;
        let options: Object = {
            auth: {
                path: DHAPI.HOME_PATH,
                checkLogin: true
            },
            account: req.session.account,
            name: req.session.name,
            picture: req.session.picture, 
            loginTime: req.session.time
        };
        this.render(req, res, "home/index", options);
    }
}