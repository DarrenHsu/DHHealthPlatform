"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseRoute_1 = require("../BaseRoute");
const ResultCode_1 = require("../ResultCode");
class BaseAPI extends BaseRoute_1.BaseRoute {
    static create(router) { }
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
exports.BaseAPI = BaseAPI;
