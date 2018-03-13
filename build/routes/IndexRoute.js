"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseRoute_1 = require("./BaseRoute");
const DHAPI_1 = require("../const/DHAPI");
const DHLog_1 = require("../util/DHLog");
class IndexRoute extends BaseRoute_1.BaseRoute {
    static create(router) {
        DHLog_1.DHLog.d("[" + this.name + ":create] " + DHAPI_1.DHAPI.ROOT_PATH);
        router.get(DHAPI_1.DHAPI.ROOT_PATH, (req, res, next) => {
            var isLogin = false;
            if (req.session.account) {
                isLogin = true;
            }
            if (isLogin) {
                new IndexRoute().index(req, res, next);
            }
            else {
                var fullUrl = this.getFullHostUrl(req);
                DHLog_1.DHLog.d("fullUrl " + fullUrl);
                var authUrl = fullUrl + DHAPI_1.DHAPI.API_LINELAUTH_PATH;
                DHLog_1.DHLog.d("authUrl " + authUrl);
                return res.redirect(DHAPI_1.DHAPI.LOGIN_INPUT_PATH);
            }
        });
    }
    constructor() {
        super();
    }
    index(req, res, next) {
        this.title = "Home | DHHealthPlatform | index";
        let options = {
            "message": "Welcome to the Index",
            "account": req.session.account,
            "loginTime": req.session.time
        };
        this.render(req, res, "index", options);
    }
}
exports.IndexRoute = IndexRoute;
