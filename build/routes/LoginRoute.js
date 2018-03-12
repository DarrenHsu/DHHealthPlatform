"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseRoute_1 = require("./BaseRoute");
const DHAPI_1 = require("../const/DHAPI");
const DHLog_1 = require("../util/DHLog");
class LoginRoute extends BaseRoute_1.BaseRoute {
    static create(router) {
        DHLog_1.DHLog.d("[" + this.name + ":create] " + DHAPI_1.DHAPI.LOGIN_INPUT_PATH);
        router.get(DHAPI_1.DHAPI.LOGIN_INPUT_PATH, (req, res, next) => {
            new LoginRoute().loginPage(req, res, next);
        });
        DHLog_1.DHLog.d("[" + this.name + ":create] " + DHAPI_1.DHAPI.LOGIN_PROCESS_PATH);
        router.post(DHAPI_1.DHAPI.LOGIN_PROCESS_PATH, (req, res, next) => {
            var act = req.body.user.account;
            var pwd = req.body.user.password;
            DHLog_1.DHLog.ld("act:" + act + " pwd:" + pwd);
            if (act == null || pwd == null) {
                new LoginRoute().loginPage(req, res, next);
            }
            else if (act == req.session.account) {
                req.session.time++;
                return res.redirect(DHAPI_1.DHAPI.ROOT_PATH);
            }
            else {
                req.session.account = act;
                req.session.time = 1;
                return res.redirect(DHAPI_1.DHAPI.ROOT_PATH);
            }
        });
        DHLog_1.DHLog.d("[" + this.name + ":create] " + DHAPI_1.DHAPI.LOGIN_KILL_PATH);
        router.get(DHAPI_1.DHAPI.LOGIN_KILL_PATH, (req, res, next) => {
            if (req.session.account) {
                DHLog_1.DHLog.d(req.session.account + "logout");
            }
            req.session.destroy;
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
