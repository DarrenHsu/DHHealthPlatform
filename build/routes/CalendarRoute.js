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
        DHLog_1.DHLog.d("[" + this.name + ":create] " + DHAPI_1.DHAPI.CALENDAR_INDEX_PATH);
        router.get(DHAPI_1.DHAPI.CALENDAR_INDEX_PATH, (req, res, next) => {
            new CalendarRoute().calendarIndex(req, res, next);
        });
    }
    calendarIndex(req, res, next) {
        this.title = BaseRoute_1.BaseRoute.AP_TITLE;
        let options = {
            "message": "Welcome to the Index",
        };
        this.render(req, res, "calendar/index", options);
    }
}
exports.CalendarRoute = CalendarRoute;
