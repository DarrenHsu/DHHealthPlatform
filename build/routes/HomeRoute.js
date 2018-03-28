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
        var app = new HomeRoute();
        app.getTestIndex(router);
        app.getIndex(router);
    }
    /**
     * @description 測試頁面
     * @param router
     */
    getTestIndex(router) {
        DHLog_1.DHLog.d("[" + HomeRoute.name + ":create] " + DHAPI_1.DHAPI.HOME_PATH);
        router.get(DHAPI_1.DHAPI.HOME_PATH, (req, res, next) => {
            this.renderTestIndex(req, res, next);
        });
    }
    /**
     * @description 首頁畫面
     * @param router
     */
    getIndex(router) {
        DHLog_1.DHLog.d("[" + HomeRoute.name + ":create] " + DHAPI_1.DHAPI.ROOT_PATH);
        router.get(DHAPI_1.DHAPI.ROOT_PATH, (req, res, next) => {
            if (!HomeRoute.checkLogin(req, res, next)) {
                return;
            }
            this.renderIndex(req, res, next);
        });
    }
    renderTestIndex(req, res, next) {
        this.title = BaseRoute_1.BaseRoute.AP_TITLE;
        let options = {
            auth: {
                path: DHAPI_1.DHAPI.HOME_PATH,
                checkLogin: true
            },
            name: req.session.name,
        };
        this.render(req, res, "home/index", options);
    }
    renderIndex(req, res, next) {
        this.title = BaseRoute_1.BaseRoute.AP_TITLE;
        let options = {
            auth: {
                path: DHAPI_1.DHAPI.HOME_PATH,
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
exports.HomeRoute = HomeRoute;
