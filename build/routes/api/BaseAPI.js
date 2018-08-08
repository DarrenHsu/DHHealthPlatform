"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
            if (!this.checkHeaderAndSend(req, res))
                return;
            if (!this.checkParamWithIdAndSend(req, res))
                return;
            this.helper.find(req.params.id, (code, results) => {
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
            if (!this.checkHeaderAndSend(req, res))
                return;
            if (!this.checkParamWithIdAndSend(req, res))
                return;
            if (!this.checkBodyAndSend(req, res))
                return;
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
            if (!this.checkHeaderAndSend(req, res))
                return;
            if (!this.checkBodyAndSend(req, res))
                return;
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
            if (!this.checkHeaderAndSend(req, res))
                return;
            if (!this.checkParamWithIdAndSend(req, res))
                return;
            this.helper.remove(req.params.id, (code) => {
                this.sendSuccess(res, code);
            });
        });
    }
    sendSuccess(res, code, result) {
        this.sendJsonResult(res, BaseRoute_1.BaseRoute.createResult(result, code));
    }
}
exports.BaseAPI = BaseAPI;
