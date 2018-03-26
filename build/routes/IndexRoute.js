"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseRoute_1 = require("./BaseRoute");
const DHAPI_1 = require("../const/DHAPI");
const DHLog_1 = require("../util/DHLog");
class IndexRoute extends BaseRoute_1.BaseRoute {
    constructor() {
        super();
    }
    static create(router) {
        DHLog_1.DHLog.d("[" + this.name + ":create] " + DHAPI_1.DHAPI.ROOT_PATH);
        router.get(DHAPI_1.DHAPI.ROOT_PATH, (req, res, next) => {
            if (!this.checkLogin(req, res, next)) {
                return;
            }
            new IndexRoute().index(req, res, next);
        });
        DHLog_1.DHLog.d("[" + this.name + ":create] " + DHAPI_1.DHAPI.CALENDAR_INDEX_PATH);
        router.get(DHAPI_1.DHAPI.CALENDAR_INDEX_PATH, (req, res, next) => {
            new IndexRoute().calendarIndex(req, res, next);
        });
    }
    index(req, res, next) {
        this.title = BaseRoute_1.BaseRoute.AP_TITLE;
        let options = {
            "message": "Welcome to the Index",
            "account": req.session.account,
            "name": req.session.name,
            "picture": req.session.picture,
            "loginTime": req.session.time
        };
        this.render(req, res, "index", options);
    }
    calendarIndex(req, res, next) {
        this.title = BaseRoute_1.BaseRoute.AP_TITLE;
        let options = {
            "message": "Welcome to the Index",
        };
        this.render(req, res, "calendar/index", options);
    }
}
exports.IndexRoute = IndexRoute;
