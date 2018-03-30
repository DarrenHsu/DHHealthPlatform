import os = require("os");
import { NextFunction, Request, Response, Router } from "express";
import { DHAPI } from "../const/DHAPI";
import { DHLog } from "../util/DHLog";
import { BaseRoute } from "./BaseRoute";
import { LINEAPI } from "../const/LINEAPI";

export class CalendarRoute extends BaseRoute {
    
    constructor() {
        super();
    }

    public static create(router: Router) {
        var app = new CalendarRoute();

        app.getCalendar(router);
    }

    /**
     * @description 產生行程頁面
     * @param router 
     */
    public getCalendar(router: Router) {
        DHLog.d("[" + CalendarRoute.name + ":create] " + DHAPI.CALENDAR_PATH);
        router.get(DHAPI.CALENDAR_PATH, (req: Request, res: Response, next: NextFunction) => {
            if (!this.checkLogin(req, res, next)) {
                return;
            }
            
            this.renderCalendar(req, res, next);
        });
    }

    public renderCalendar(req: Request, res: Response, next: NextFunction) {
        this.title = BaseRoute.AP_TITLE;
        let options: Object = {
            auth: this.getAuth(req, DHAPI.CALENDAR_PATH, true),
        };
        this.render(req, res, "calendar/index", options);
    }
}