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
        DHLog.d("[" + this.name + ":create] " + DHAPI.CALENDAR_INDEX_PATH);
        router.get(DHAPI.CALENDAR_INDEX_PATH, (req: Request, res: Response, next: NextFunction) => {
            new CalendarRoute().calendarIndex(req, res, next);
        });
    }

    public calendarIndex(req: Request, res: Response, next: NextFunction) {
        this.title = BaseRoute.AP_TITLE;
        let options: Object = {
            "message": "Welcome to the Index",
        };
        this.render(req, res, "calendar/index", options);
    }
}