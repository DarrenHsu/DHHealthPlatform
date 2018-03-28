"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DHAPI_1 = require("../const/DHAPI");
const DHLog_1 = require("../util/DHLog");
const BaseRoute_1 = require("./BaseRoute");
class CalendarRoute extends BaseRoute_1.BaseRoute {
    constructor() {
        super();
    }
    static create(router) {
        var app = new CalendarRoute();
        app.getCalendar(router);
    }
    /**
     * @description 產生行程頁面
     * @param router
     */
    getCalendar(router) {
        DHLog_1.DHLog.d("[" + CalendarRoute.name + ":create] " + DHAPI_1.DHAPI.CALENDAR_PATH);
        router.get(DHAPI_1.DHAPI.CALENDAR_PATH, (req, res, next) => {
            this.renderCalendar(req, res, next);
        });
    }
    renderCalendar(req, res, next) {
        this.title = BaseRoute_1.BaseRoute.AP_TITLE;
        let options = {
            auth: {
                path: DHAPI_1.DHAPI.CALENDAR_PATH,
                checkLogin: true
            }
        };
        this.render(req, res, "calendar/index", options);
    }
}
exports.CalendarRoute = CalendarRoute;
