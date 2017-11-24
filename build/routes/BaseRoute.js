"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ResultCode_1 = require("./ResultCode");
class BaseRoute {
    constructor() {
        this.title = "DHHealthPlatform";
        this.scripts = [];
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
