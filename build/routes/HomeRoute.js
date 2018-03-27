"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseRoute_1 = require("./BaseRoute");
const DHAPI_1 = require("../const/DHAPI");
const DHLog_1 = require("../util/DHLog");
class HomeRoute extends BaseRoute_1.BaseRoute {
    constructor() {
        super();
    }
    static create(router) {
        DHLog_1.DHLog.d("[" + this.name + ":create] " + DHAPI_1.DHAPI.ROOT_PATH);
        router.get(DHAPI_1.DHAPI.ROOT_PATH, (req, res, next) => {
            if (!this.checkLogin(req, res, next)) {
                return;
            }
            new HomeRoute().loginIndex(req, res, next);
        });
        DHLog_1.DHLog.d("[" + this.name + ":create] " + DHAPI_1.DHAPI.HOME_PATH);
        router.get(DHAPI_1.DHAPI.HOME_PATH, (req, res, next) => {
            new HomeRoute().index(req, res, next);
        });
    }
    index(req, res, next) {
        this.title = BaseRoute_1.BaseRoute.AP_TITLE;
        let options = {
            "message": "Welcome to the Index",
            "name": req.session.name,
        };
        this.render(req, res, "home/index", options);
    }
    loginIndex(req, res, next) {
        this.title = BaseRoute_1.BaseRoute.AP_TITLE;
        let options = {
            "message": "Welcome to the Index",
            "account": req.session.account,
            "name": req.session.name,
            "picture": req.session.picture,
            "loginTime": req.session.time
        };
        this.render(req, res, "home/index", options);
    }
}
exports.HomeRoute = HomeRoute;
