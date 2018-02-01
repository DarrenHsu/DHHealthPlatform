"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseRoute_1 = require("../BaseRoute");
const ResultCode_1 = require("../ResultCode");
class BaseAPI extends BaseRoute_1.BaseRoute {
    static create(router) { }
    get(router) {
        router.get(this.uri + "/:id", (req, res, next) => {
            if (!this.checkHeader(req)) {
                this.sendAuthFaild(res);
                return;
            }
            if (!req.params.id) {
                this.sendParamsFaild(res);
                return;
            }
            this.helper.list(req.params.id, (code, results) => {
                this.sendSuccess(res, code);
            });
        });
    }
    put(router) {
        router.put(this.uri + "/:id", (req, res, next) => {
            if (!this.checkHeader(req)) {
                this.sendAuthFaild(res);
                return;
            }
            if (!req.params.id) {
                this.sendParamsFaild(res);
                return;
            }
            if (!(req.body)) {
                this.sendBodyFaild(res);
                return;
            }
            this.helper.save(req.params.id, req.body, (code, result) => {
                this.sendSuccess(res, code);
            });
        });
    }
    post(router) {
        router.post(this.uri, (req, res, next) => {
            if (!this.checkHeader(req)) {
                this.sendAuthFaild(res);
                return;
            }
            if (!req.body) {
                this.sendBodyFaild(res);
                return;
            }
            this.helper.add(req.body, (code, result) => {
                this.sendSuccess(res, code);
            });
        });
    }
    delete(router) {
        router.delete(this.uri + "/:id", (req, res, next) => {
            if (!this.checkHeader(req)) {
                this.sendAuthFaild(res);
                return;
            }
            if (!req.params.id) {
                this.sendParamsFaild(res);
                return;
            }
            this.helper.remove(req.params.id, (code) => {
                this.sendSuccess(res, code);
            });
        });
    }
    sendSuccess(res, code) {
        res.setHeader("Content-type", "application/json");
        res.json(BaseRoute_1.BaseRoute.createResult(null, code));
        res.end();
    }
    sendFaild(res, code) {
        res.setHeader("Content-type", "application/json");
        res.json(BaseRoute_1.BaseRoute.createResult(null, code));
        res.end();
    }
    sendAuthFaild(res) {
        res.setHeader("Content-type", "application/json");
        res.statusCode = 403;
        res.json(BaseRoute_1.BaseRoute.createResult(null, ResultCode_1.CONNECTION_CODE.CC_AUTH_ERROR));
        res.end();
    }
    sendParamsFaild(res) {
        res.setHeader("Content-type", "application/json");
        res.json(BaseRoute_1.BaseRoute.createResult(null, ResultCode_1.CONNECTION_CODE.CC_PARAMETER_ERROR));
        res.end();
    }
    sendBodyFaild(res) {
        res.setHeader("Content-type", "application/json");
        res.json(BaseRoute_1.BaseRoute.createResult(null, ResultCode_1.CONNECTION_CODE.CC_REQUEST_BODY_ERROR));
        res.end();
    }
}
exports.BaseAPI = BaseAPI;
