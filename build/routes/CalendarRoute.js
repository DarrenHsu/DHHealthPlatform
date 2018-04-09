"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
const DHDateFormat_1 = require("../const/DHDateFormat");
const DHAPI_1 = require("../const/DHAPI");
const DHLog_1 = require("../util/DHLog");
const BaseRoute_1 = require("./BaseRoute");
const DBHelper_1 = require("../mongo/helper/DBHelper");
const RouteHelper_1 = require("../mongo/helper/RouteHelper");
const UserHelper_1 = require("../mongo/helper/UserHelper");
class CalendarRoute extends BaseRoute_1.BaseRoute {
    constructor(connection) {
        super();
        this.routeHelper = new RouteHelper_1.RouteHelper(connection);
        this.userHelper = new UserHelper_1.UserHelper(connection);
    }
    static create(router) {
        var app = new CalendarRoute(DBHelper_1.DBHelper.connection);
        app.getCalendar(router);
        app.getCalendarFeed(router);
    }
    /**
     * @description 產生行程頁面
     * @param router
     */
    getCalendar(router) {
        DHLog_1.DHLog.d("[" + CalendarRoute.name + ":create] " + DHAPI_1.DHAPI.CALENDAR_PATH);
        router.get(DHAPI_1.DHAPI.CALENDAR_PATH, (req, res, next) => {
            if (!this.checkLogin(req, res, next)) {
                return;
            }
            this.renderCalendar(req, res, next);
        });
    }
    getCalendarFeed(router) {
        DHLog_1.DHLog.d("[" + CalendarRoute.name + ":create] " + DHAPI_1.DHAPI.CALENDAR_FEED_PATH);
        router.get(DHAPI_1.DHAPI.CALENDAR_FEED_PATH, (req, res, next) => {
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
                var events = [];
                for (let route of rts) {
                    if (!(route.startTime && route.endTime))
                        continue;
                    var s = moment(route.startTime).utcOffset("+0000").format(DHDateFormat_1.DHDateFormat.DATE_FORMAT + " " + DHDateFormat_1.DHDateFormat.TIME_FORMAT);
                    var e = moment(route.endTime).utcOffset("+0000").format(DHDateFormat_1.DHDateFormat.DATE_FORMAT + " " + DHDateFormat_1.DHDateFormat.TIME_FORMAT);
                    var event = {
                        id: route._id,
                        title: route.name,
                        start: s,
                        end: e,
                        textColor: "#ffffff"
                    };
                    events.push(event);
                }
                this.sendJsonResult(res, events);
            });
        });
    }
    renderCalendar(req, res, next) {
        this.title = BaseRoute_1.BaseRoute.AP_TITLE;
        let options = {
            auth: this.getAuth(req, DHAPI_1.DHAPI.CALENDAR_PATH, true)
        };
        this.render(req, res, "calendar/index", options);
    }
}
exports.CalendarRoute = CalendarRoute;
