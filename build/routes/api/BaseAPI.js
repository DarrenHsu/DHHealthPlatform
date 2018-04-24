"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ResultCode_1 = require("../ResultCode");
const DHLog_1 = require("../../util/DHLog");
const BaseRoute_1 = require("../BaseRoute");
/**
 * @description 所有 api 的父類別
 */
class BaseAPI extends BaseRoute_1.BaseRoute {
    static create(router) { }
    /**
     * @description 取得資料處理程序
     * @param router
     */
    get(router) {
        router.get(this.uri + '/:id', (req, res, next) => {
            if (!this.checkHeader(req)) {
                this.sendAuthFaild(res);
                return;
            }
            if (!req.params.id) {
                this.sendParamsFaild(res);
                return;
            }
            this.helper.find(req.params.id, (code, results) => {
                DHLog_1.DHLog.d("send success");
                this.sendSuccess(res, code, results);
            });
        });
    }
    /**
     * @description 修改資料處理程序
     * @param router
     */
    put(router) {
        router.put(this.uri + '/:id', (req, res, next) => {
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
                this.sendSuccess(res, code, result);
            });
        });
    }
    /**
     * @description 儲存資料處理程序
     * @param router
     */
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
                this.sendSuccess(res, code, result);
            });
        });
    }
    /**
     * @description 刪除資料處理程序
     * @param router
     */
    delete(router) {
        router.delete(this.uri + '/:id', (req, res, next) => {
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
    sendSuccess(res, code, result) {
        this.sendJsonResult(res, BaseRoute_1.BaseRoute.createResult(result, code));
    }
    /**
     * @description 回傳失敗處理程序
     * @param res
     * @param code
     */
    sendFaild(res, code) {
        this.sendJsonResult(res, BaseRoute_1.BaseRoute.createResult(null, code));
    }
    /**
     * @description 回傳授權失敗處理程序
     * @param res
     */
    sendAuthFaild(res) {
        res.statusCode = 403;
        this.sendJsonResult(res, BaseRoute_1.BaseRoute.createResult(null, ResultCode_1.CONNECTION_CODE.CC_AUTH_ERROR));
    }
    /**
     * @description 回傳參數錯誤處理程序
     * @param res
     */
    sendParamsFaild(res) {
        this.sendJsonResult(res, BaseRoute_1.BaseRoute.createResult(null, ResultCode_1.CONNECTION_CODE.CC_PARAMETER_ERROR));
    }
    /**
     * @description 回傳接收資料錯誤處理程序
     * @param res
     */
    sendBodyFaild(res) {
        this.sendJsonResult(res, BaseRoute_1.BaseRoute.createResult(null, ResultCode_1.CONNECTION_CODE.CC_REQUEST_BODY_ERROR));
    }
}
exports.BaseAPI = BaseAPI;
