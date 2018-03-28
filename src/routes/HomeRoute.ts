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
        var app = new HomeRoute();

        app.getTestIndex(router);
        app.getIndex(router);
    }

    /**
     * @description 測試頁面
     * @param router 
     */
    public getTestIndex(router: Router) {
        DHLog.d("[" + HomeRoute.name + ":create] " + DHAPI.HOME_PATH);
        router.get(DHAPI.HOME_PATH, (req: Request, res: Response, next: NextFunction) => {
            this.renderTestIndex(req, res, next);
        });
    }

    /**
     * @description 首頁畫面
     * @param router 
     */
    public getIndex(router: Router) {
        DHLog.d("[" + HomeRoute.name + ":create] " + DHAPI.ROOT_PATH);
        router.get(DHAPI.ROOT_PATH, (req: Request, res: Response, next: NextFunction) => {
            if (!HomeRoute.checkLogin(req, res, next)) {
                return;
            }
            
            this.renderIndex(req, res, next);
        });
    }

    public renderTestIndex(req: Request, res: Response, next: NextFunction) {
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

    public renderIndex(req: Request, res: Response, next: NextFunction) {
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