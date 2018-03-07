"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseRoute_1 = require("./BaseRoute");
const DHAPI_1 = require("../const/DHAPI");
const DHLog_1 = require("../util/DHLog");
class LoginRoute extends BaseRoute_1.BaseRoute {
    static create(router) {
        DHLog_1.DHLog.d("[" + this.name + ":create] " + DHAPI_1.DHAPI.ROOT_PATH);
        router.get(DHAPI_1.DHAPI.LOGIN_PATH, (req, res, next) => {
            new LoginRoute().index(req, res, next);
        });
    }
    constructor() {
        super();
    }
    index(req, res, next) {
        this.title = "Home | DHHealthPlatform | login";
        let options = {
            "message": "Welcome to the login"
        };
        this.render(req, res, "login", options);
    }
}
exports.LoginRoute = LoginRoute;
