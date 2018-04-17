import * as mongoose from 'mongoose';
import { NextFunction, Request, Response, Router } from 'express';
import { BaseRoute } from '../BaseRoute';
import { CONNECTION_CODE, MONGODB_CODE, ResultCodeMsg } from '../ResultCode';
import { DBHelper } from '../../mongo/helper/DBHelper';
import { BaseHelper } from '../../mongo/helper/BaseHelper';
import { IBase } from '../../mongo/interface/IBase';
import { DHAPI } from '../../const/DHAPI';
import { DHLog } from '../../util/DHLog';

export class BaseAPI extends BaseRoute {

    protected helper: BaseHelper;
    protected uri: string;

    public static create(router: Router) {}

    /**
     * @description 取得資料處理程序
     * @param router 
     */
    protected get(router: Router) {
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
                this.sendSuccess(res, code, results);
            });
        });
    }

    /**
     * @description 修改資料處理程序
     * @param router 
     */
    protected put(router: Router) {
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
    protected post(router: Router) {
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
    protected delete(router: Router) {
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

    /**
     * @description 回傳成功處理程序
     * @param res 
     * @param code 
     */
    protected sendSuccess(res: Response, code: number)
    protected sendSuccess(res: Response, code: number, result: IBase)
    protected sendSuccess(res: Response, code: number, result?: IBase) {
        this.sendJsonResult(res, BaseRoute.createResult(result, code));
    }

    /**
     * @description 回傳失敗處理程序
     * @param res 
     * @param code 
     */
    protected sendFaild(res: Response, code: number) {
        this.sendJsonResult(res, BaseRoute.createResult(null, code));
    }

    /**
     * @description 回傳授權失敗處理程序
     * @param res 
     */
    protected sendAuthFaild(res: Response) {
        res.statusCode = 403;
        this.sendJsonResult(res, BaseRoute.createResult(null, CONNECTION_CODE.CC_AUTH_ERROR));
    }

    /**
     * @description 回傳參數錯誤處理程序
     * @param res 
     */
    protected sendParamsFaild(res: Response) {
        this.sendJsonResult(res, BaseRoute.createResult(null, CONNECTION_CODE.CC_PARAMETER_ERROR));
    }

    /**
     * @description 回傳接收資料錯誤處理程序
     * @param res 
     */
    protected sendBodyFaild(res: Response) {
        this.sendJsonResult(res, BaseRoute.createResult(null, CONNECTION_CODE.CC_REQUEST_BODY_ERROR));
    }
}