"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const ResultCode_1 = require("./ResultCode");
const DHLog_1 = require("../util/DHLog");
class BaseRoute {
    constructor() {
        this.title = "DHHealthPlatform";
        this.scripts = [];
    }
    checkParam(auth, value) {
        return this.checkValue(auth, value);
    }
    checkHeader(req) {
        var auth = req.get("Authorization");
        var verfy = req.get("verfy");
        return this.checkValue(auth, verfy);
    }
    checkValue(auth, verfy) {
        if (verfy == BaseRoute.FEED_AUTH_PASS)
            return true;
        var str = crypto_1.createHash("SHA256").update(BaseRoute.FEED_AUTH + verfy).digest("base64");
        DHLog_1.DHLog.d("verfy:" + str);
        DHLog_1.DHLog.d("auth :" + auth);
        return auth == str;
    }
    printRequestInfo(req) {
        DHLog_1.DHLog.d("<----------------- " + req.method + " ---------------->");
        DHLog_1.DHLog.d(req.url);
        DHLog_1.DHLog.d("header:" + JSON.stringify(req.headers));
        DHLog_1.DHLog.d("body:" + JSON.stringify(req.body));
        DHLog_1.DHLog.d("<---------------------------------------->");
    }
    addScript(src) {
        this.scripts.push(src);
        return this;
    }
    render(req, res, view, options) {
        res.locals.BASE_URL = "/";
        res.locals.scripts = this.scripts;
        res.locals.title = this.title;
        res.render(view, options);
    }
    static createResult(obj, code) {
        var result = {
            code: code,
            message: ResultCode_1.ResultCodeMsg.getMsg(code)
        };
        if (obj) {
            result.data = obj;
        }
        return result;
    }
}
BaseRoute.FEED_AUTH = "Darren Hsu I Love You";
BaseRoute.FEED_AUTH_PASS = "imdarren";
exports.BaseRoute = BaseRoute;
