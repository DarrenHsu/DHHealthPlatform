"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DHLog_1 = require("../util/DHLog");
const BaseRoute_1 = require("./BaseRoute");
const DHAPI_1 = require("../const/DHAPI");
const LINEAPI_1 = require("../const/LINEAPI");
class LoginRoute extends BaseRoute_1.BaseRoute {
    static create(router) {
        DHLog_1.DHLog.d("[" + this.name + ":create] " + DHAPI_1.DHAPI.LOGIN_INPUT_PATH);
        router.get(DHAPI_1.DHAPI.LOGIN_INPUT_PATH, (req, res, next) => {
            new LoginRoute().loginPage(req, res, next);
        });
        DHLog_1.DHLog.d("[" + this.name + ":create] " + DHAPI_1.DHAPI.LOGIN_PROCESS_PATH);
        router.get(DHAPI_1.DHAPI.LOGIN_PROCESS_PATH, (req, res, next) => {
            var act = req.session.account;
            if (!act) {
                var fullUrl = this.getFullHostUrl(req);
                var authUrl = encodeURIComponent(fullUrl + LINEAPI_1.LINEAPI.API_LINE_AUTH_PATH);
                var channelId = DHAPI_1.DHAPI.pkgjson.linelogin.channelId;
                var channelSecret = DHAPI_1.DHAPI.pkgjson.linelogin.channelSecret;
                var lineApi = LINEAPI_1.LINEAPI.API_AUTHORIZE + "?" +
                    "response_type=code" + "&" +
                    "client_id=" + channelId + "&" +
                    "redirect_uri=" + authUrl + "&" +
                    "state=" + "2018031300001" + "&" +
                    "scope=openid%20profile";
                DHLog_1.DHLog.d("lineApi " + lineApi);
                return res.redirect(lineApi);
            }
            else {
                var name = req.session.name;
                var picture = req.session.picture;
                DHLog_1.DHLog.ld("act:" + act + " name:" + name);
                return res.redirect(DHAPI_1.DHAPI.ROOT_PATH);
            }
        });
        DHLog_1.DHLog.d("[" + this.name + ":create] " + DHAPI_1.DHAPI.LOGIN_KILL_PATH);
        router.get(DHAPI_1.DHAPI.LOGIN_KILL_PATH, (req, res, next) => {
            if (req.session.account) {
                DHLog_1.DHLog.d(req.session.account + " logout");
            }
            req.session.destroy((err) => {
                if (err) {
                    DHLog_1.DHLog.d("session destroy error:" + err);
                }
            });
            return res.redirect(DHAPI_1.DHAPI.ROOT_PATH);
        });
    }
    constructor() {
        super();
    }
    loginPage(req, res, next) {
        this.title = "Home | DHHealthPlatform | Login Success";
        let options = {
            "message": "Welcome to the login"
        };
        this.render(req, res, "login", options);
    }
    loginSuccess(req, res, next) {
        this.title = "Home | DHHealthPlatform | Login Success";
        let options = {
            "message": "Welcome to the login"
        };
        this.render(req, res, "loginResult", options);
    }
    loginError(req, res, next) {
        this.title = "Home | DHHealthPlatform | Login Faild";
        let options = {
            "message": "Welcome to the login"
        };
        this.render(req, res, "loginResult", options);
    }
}
exports.LoginRoute = LoginRoute;
