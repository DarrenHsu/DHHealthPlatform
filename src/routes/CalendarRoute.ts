import * as mongoose from 'mongoose';
import * as moment from 'moment';
import { NextFunction, Request, Response, Router, IRoute } from 'express';

import { DHDateFormat }     from '../const/DHDateFormat';
import { DHAPI }            from '../const/DHAPI';
import { LINEAPI }          from '../const/LINEAPI';

import { DHLog }            from '../util/DHLog';

import { BaseRoute }        from './BaseRoute';
import { IEvent }           from './interface/IEvent';

import { DBHelper }         from '../mongo/helper/DBHelper';
import { RouteHelper }      from '../mongo/helper/RouteHelper';
import { UserHelper }       from '../mongo/helper/UserHelper';

/**
 * @description 行事曆路由控制
 */
export class CalendarRoute extends BaseRoute {

    private routeHelper: RouteHelper;
    private userHelper: UserHelper;
    
    constructor(connection: mongoose.Connection) {
        super();

        this.routeHelper = new RouteHelper(connection);
        this.userHelper = new UserHelper(connection);
    }

    public static create(router: Router) {
        var app = new CalendarRoute(DBHelper.connection);

        app.getCalendar(router);
        app.getCalendarFeed(router);
    }

    /**
     * @description 產生行程頁面
     * @param router 
     */
    public getCalendar(router: Router) {
        DHLog.d('[' + CalendarRoute.name + ':create] ' + DHAPI.CALENDAR_PATH);
        router.get(DHAPI.CALENDAR_PATH, (req: Request, res: Response, next: NextFunction) => {
            if (!this.checkLogin(req, res, next)) {
                return;
            }

            this.renderCalendar(req, res, next);
        });
    }

    public getCalendarFeed(router: Router) {
        DHLog.d('[' + CalendarRoute.name + ':create] ' + DHAPI.CALENDAR_FEED_PATH);
        router.get(DHAPI.CALENDAR_FEED_PATH, (req: Request, res: Response, next: NextFunction) => {
            if (!this.checkLogin(req, res, next)) {
                return;
            }

            if (!req.query.start || !req.query.end) {
                this.sendJsonResult(res, {});
                return;
            }

            var start = req.query.start;
            var end = req.query.end;

            this.routeHelper.find(req.session.account, (code, rts) => {
                var events: IEvent[] = [];
                for (let route of rts) {
                    if (!(route.startTime && route.endTime)) 
                        continue;

                    var s = moment(route.startTime).utcOffset('+0000').format(DHDateFormat.DATE_FORMAT + ' ' + DHDateFormat.TIME_FORMAT)
                    var e = moment(route.endTime).utcOffset('+0000').format(DHDateFormat.DATE_FORMAT + ' ' + DHDateFormat.TIME_FORMAT)
                    
                    var event  = {
                        id: route._id,
                        title: route.name,
                        start: s,
                        end: e,
                        textColor: '#ffffff'
                    };
                    events.push(event);
                }
                this.sendJsonResult(res, events);
            });
        });
    }

    public renderCalendar(req: Request, res: Response, next: NextFunction) {
        this.title = BaseRoute.AP_TITLE;
        let options: Object = {
            auth: this.getAuth(req, DHAPI.CALENDAR_PATH, true)
        };
        this.render(req, res, 'calendar/index', options);
    }
}