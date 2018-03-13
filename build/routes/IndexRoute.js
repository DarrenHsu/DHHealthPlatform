"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseRoute_1 = require("./BaseRoute");
const DHAPI_1 = require("../const/DHAPI");
const LINEAPI_1 = require("../const/LINEAPI");
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
                authUrl = encodeURIComponent(authUrl);
                DHLog_1.DHLog.d("authUrl " + authUrl);
                var lineApi = LINEAPI_1.LINEAPI.API_AUTH;
                var channelId = DHAPI_1.DHAPI.pkgjson.linebot.channelId;
                var channelSecret = DHAPI_1.DHAPI.pkgjson.linebot.channelSecret;
                lineApi += "?response_type=dhhealthplatform" + "&" +
                    "client_id=" + channelId + "&" +
                    "redirect_uri=" + authUrl + "&" +
                    "scope=openid%20profile";
                DHLog_1.DHLog.d("lineApi " + lineApi);
                return res.redirect(lineApi);
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
