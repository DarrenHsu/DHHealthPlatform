import * as mongoose from "mongoose";
import * as moment from 'moment';
import { NextFunction, Request, Response, Router, IRoute } from "express";
import { DHDateFormat } from "../const/DHDateFormat";
import { DHAPI } from "../const/DHAPI";
import { DHLog } from "../util/DHLog";
import { BaseRoute } from "./BaseRoute";
import { LINEAPI } from "../const/LINEAPI";
import { DBHelper } from "../mongo/helper/DBHelper";
import { RouteHelper } from "../mongo/helper/RouteHelper";
import { UserHelper } from "../mongo/helper/UserHelper";
import { IEvent } from "./interface/IEvent";

export class CalendarRoute extends BaseRoute {

    protected routeHelper: RouteHelper;
    protected userHelper: UserHelper;
    
    constructor(connection: mongoose.Connection) {
        super();

        this.routeHelper = new RouteHelper(connection);
        this.userHelper = new UserHelper(connection);
    }

    public static create(router: Router) {
        var app = new CalendarRoute(DBHelper.connection);

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

            this.routeHelper.list(req.session.account, (code, rts) => {
                var events: IEvent[] = [];
                for (let route of rts) {
                    if (!(route.startTime && route.endTime)) 
                        continue;

                    var s = moment(route.startTime).utcOffset("+0000").format(DHDateFormat.DATE_FORMAT + " " + DHDateFormat.TIME_FORMAT)
                    var e = moment(route.endTime).utcOffset("+0000").format(DHDateFormat.DATE_FORMAT + " " + DHDateFormat.TIME_FORMAT)
                    
                    var event  = {
                        id: route._id,
                        title: route.name,
                        start: s,
                        end: e
                    };
                    events.push(event);
                }
                this.renderCalendar(req, res, next, events);
            });
        });
    }

    public renderCalendar(req: Request, res: Response, next: NextFunction, events: IEvent[]) {
        this.title = BaseRoute.AP_TITLE;
        let options: Object = {
            auth: this.getAuth(req, DHAPI.CALENDAR_PATH, true),
            events: events
        };
        this.render(req, res, "calendar/index", options);
    }
}