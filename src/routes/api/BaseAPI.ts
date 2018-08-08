import { Response, Router } from 'express';

import { BaseRoute }    from '../BaseRoute';

import { BaseHelper }   from '../../mongo/helper/BaseHelper';
import { IBase }        from '../../mongo/interface/IBase';

/**
 * @description 所有 api 的父類別
 */
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
            if (!this.checkHeaderAndSend(req, res)) return;
            if (!this.checkParamWithIdAndSend(req, res)) return;

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
            if (!this.checkHeaderAndSend(req, res)) return;
            if (!this.checkParamWithIdAndSend(req, res)) return;
            if (!this.checkBodyAndSend(req, res)) return;
            
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
            if (!this.checkHeaderAndSend(req, res)) return;
            if (!this.checkBodyAndSend(req, res)) return;
        
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
            if (!this.checkHeaderAndSend(req, res)) return;
            if (!this.checkParamWithIdAndSend(req, res)) return;

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
}