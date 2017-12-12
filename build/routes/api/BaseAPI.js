"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const BaseRoute_1 = require("../BaseRoute");
const ResultCode_1 = require("../ResultCode");
const DHLog_1 = require("../../util/DHLog");
class BaseAPI extends BaseRoute_1.BaseRoute {
    static create(router) { }
    checkHeader(req) {
        var auth = req.header["Authorization"];
        var verfy = req.header["verfy"];
        return this.checkValue(auth, verfy);
    }
    checkValue(auth, text) {
        if (text == BaseAPI.FEED_AUTH_PASS)
            return true;
        var s0 = crypto_1.createHash("SHA256").update(BaseAPI.FEED_AUTH + test).digest("base64");
        DHLog_1.DHLog.d("s0  :" + s0);
        DHLog_1.DHLog.d("auth:" + auth);
        return auth == s0;
    }
    get(router) {
        router.get(this.uri + "/:userId", (req, res, next) => {
            res.setHeader("Content-type", "application/json");
            if (!req.params.userId) {
                res.json(BaseRoute_1.BaseRoute.createResult(null, ResultCode_1.CONNECTION_CODE.CC_PARAMETER_ERROR));
                return;
            }
            this.helper.list(req.params.userId, (code, results) => {
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
                res.json(BaseRoute_1.BaseRoute.createResult(null, ResultCode_1.CONNECTION_CODE.CC_AUTH_ERROR));
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
