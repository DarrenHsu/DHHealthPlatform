"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseRoute_1 = require("./BaseRoute");
const DHAPI_1 = require("../const/DHAPI");
const DHLog_1 = require("../util/DHLog");
/**
 * @description 首頁路由控制
 */
class HomeRoute extends BaseRoute_1.BaseRoute {
    constructor() {
        super();
    }
    static create(router) {
        var app = new HomeRoute();
        app.getIndex(router);
        app.getHome(router);
    }
    /**
     * @description 首頁畫面
     * @param router
     */
    getIndex(router) {
        DHLog_1.DHLog.d('[' + HomeRoute.name + ':create] ' + DHAPI_1.DHAPI.ROOT_PATH);
        router.get(DHAPI_1.DHAPI.ROOT_PATH, (req, res, next) => {
            if (!this.checkLogin(req, res, next)) {
                return;
            }
            this.renderHome(req, res, next);
        });
    }
    /**
     * @description 首頁畫面
     * @param router
     */
    getHome(router) {
        DHLog_1.DHLog.d('[' + HomeRoute.name + ':create] ' + DHAPI_1.DHAPI.HOME_PATH);
        router.get(DHAPI_1.DHAPI.HOME_PATH, (req, res, next) => {
            if (!this.checkLogin(req, res, next)) {
                return;
            }
            this.renderHome(req, res, next);
        });
    }
    renderHome(req, res, next) {
        this.title = BaseRoute_1.BaseRoute.AP_TITLE;
        let options = {
            auth: this.getAuth(req, DHAPI_1.DHAPI.HOME_PATH, true),
            account: req.session.account,
            name: req.session.name,
            picture: req.session.picture,
        };
        this.render(req, res, 'home/index', options);
    }
}
exports.HomeRoute = HomeRoute;
