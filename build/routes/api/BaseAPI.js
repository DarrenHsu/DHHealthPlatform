"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const BaseRoute_1 = require("../BaseRoute");
const ResultCode_1 = require("../ResultCode");
const DHLog_1 = require("../../util/DHLog");
class BaseAPI extends BaseRoute_1.BaseRoute {
    static create(router) { }
    checkHeader(req) {
        var auth = req.get("Authorization");
        var verfy = req.get("verfy");
        return this.checkValue(auth, verfy);
    }
    checkValue(auth, verfy) {
        if (verfy == BaseAPI.FEED_AUTH_PASS)
            return true;
        var str = crypto_1.createHash("SHA256").update(BaseAPI.FEED_AUTH + verfy).digest("base64");
        DHLog_1.DHLog.d("verfy:" + str);
        DHLog_1.DHLog.d("auth :" + auth);
        return auth == str;
    }
    get(router) {
        router.get(this.uri + "/:id", (req, res, next) => {
            res.setHeader("Content-type", "application/json");
            if (!req.params.id) {
                res.json(BaseRoute_1.BaseRoute.createResult(null, ResultCode_1.CONNECTION_CODE.CC_PARAMETER_ERROR));
                return;
            }
            this.helper.list(req.params.id, (code, results) => {
                res.json(BaseRoute_1.BaseRoute.createResult(results, code));
            });
        });
    }
    put(router) {
        router.put(this.uri + "/:id", (req, res, next) => {
            res.setHeader("Content-type", "application/json");
            if (!req.params.id) {
                res.json(BaseRoute_1.BaseRoute.createResult(null, ResultCode_1.CONNECTION_CODE.CC_PARAMETER_ERROR));
                return;
            }
            if (!(req.body)) {
                res.json(BaseRoute_1.BaseRoute.createResult(null, ResultCode_1.CONNECTION_CODE.CC_REQUEST_BODY_ERROR));
                return;
            }
            this.helper.save(req.params.id, req.body, (code, result) => {
                res.json(BaseRoute_1.BaseRoute.createResult(result, code));
            });
        });
    }
    post(router) {
        router.post(this.uri, (req, res, next) => {
            if (!this.checkHeader(req)) {
                res.statusCode = 403;
                res.end();
                return;
            }
            res.setHeader("Content-type", "application/json");
            if (!req.body) {
                res.json(BaseRoute_1.BaseRoute.createResult(null, ResultCode_1.CONNECTION_CODE.CC_REQUEST_BODY_ERROR));
                return;
            }
            this.helper.add(req.body, (code, result) => {
                res.json(BaseRoute_1.BaseRoute.createResult(result, code));
            });
        });
    }
    delete(router) {
        router.delete(this.uri + "/:id", (req, res, next) => {
            res.setHeader("Content-type", "application/json");
            if (!req.params.id) {
                res.json(BaseRoute_1.BaseRoute.createResult(null, ResultCode_1.CONNECTION_CODE.CC_PARAMETER_ERROR));
                return;
            }
            this.helper.remove(req.params.id, (code) => {
                res.json(BaseRoute_1.BaseRoute.createResult(null, code));
            });
        });
    }
}
BaseAPI.FEED_AUTH = "Darren Hsu I Love You";
BaseAPI.FEED_AUTH_PASS = "I'm Darren";
exports.BaseAPI = BaseAPI;
