import os = require("os");
import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "./BaseRoute";
import { DHAPI } from "../const/DHAPI";
import { LINEAPI } from "../const/LINEAPI";
import { DHLog } from "../util/DHLog";
import { LoginRoute } from "./LoginRoute";

export class IndexRoute extends BaseRoute {
    
    constructor() {
        super();
    }

    public static create(router: Router) {
        DHLog.d("[" + this.name + ":create] " + DHAPI.ROOT_PATH);
        router.get(DHAPI.ROOT_PATH, (req: Request, res: Response, next: NextFunction) => {
            if (!this.checkLogin(req, res, next)) {
                return;
            }
            
            new IndexRoute().index(req, res, next);
        });

        DHLog.d("[" + this.name + ":create] " + DHAPI.CALENDAR_INDEX_PATH);
        router.get(DHAPI.CALENDAR_INDEX_PATH, (req: Request, res: Response, next: NextFunction) => {
            new IndexRoute().calendarIndex(req, res, next);
        });
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

    public calendarIndex(req: Request, res: Response, next: NextFunction) {
        this.title = "Home | DHHealthPlatform | calendar | index";
        let options: Object = {
            "message": "Welcome to the Index",
        };
        this.render(req, res, "calendar/index", options);
    }
}