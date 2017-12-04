"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ResultCode_1 = require("./ResultCode");
const DHLog_1 = require("../util/DHLog");
class BaseRoute {
    constructor() {
        this.title = "DHHealthPlatform";
        this.scripts = [];
    }
    printRequestInfo(req) {
        var logStr = "<----------------- " + req.method + " ---------------->\n" +
            req.url + "\n" +
            "header:" + JSON.stringify(req.headers) + "\n" +
            "body:" + JSON.stringify(req.body) + "\n" +
            "<---------------------------------------->";
        DHLog_1.DHLog.d(logStr);
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
exports.BaseRoute = BaseRoute;
