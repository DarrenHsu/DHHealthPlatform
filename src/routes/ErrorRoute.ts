import { NextFunction, Request, Response, Router } from 'express';

import { CONNECTION_CODE } from './ResultCode';

import { BaseRoute }    from './BaseRoute';
import { IResult }      from './interface/IResult';

import { DHAPI }        from '../const/DHAPI';
import { DHLog }        from '../util/DHLog';

/**
 * @description 錯誤路由控制
 */
export class ErrorRoute extends BaseRoute {
    
    constructor() {
        super();
    }

    public static create(router: Router) {
        var app = new ErrorRoute();

        app.getError(router);
    }

    /**
     * @description 蟣示錯誤頁面
     * @param router 
     */
    public getError(router: Router) {
        DHLog.d('[' + ErrorRoute.name + ':create] ' + DHAPI.ERROR_PATH);
        router.get(DHAPI.ERROR_PATH + '/:errorCode', (req: Request, res: Response, next: NextFunction) => {
            var errorCode = req.params.errorCode;
            if (!errorCode) {
                var result = BaseRoute.createResult(null, CONNECTION_CODE.CC_PARAMETER_ERROR);
            }else {
                var result = BaseRoute.createResult(null, parseInt(errorCode));
            }
            this.renderError(req, res, next, result);
        });
    }
    
    public renderError(req: Request, res: Response, next: NextFunction, result: IResult) {
        this.title = BaseRoute.AP_TITLE;
        let options: Object = {
            auth: this.getAuth(req, DHAPI.ERROR_PATH, false),            
            result: result
        };
        this.render(req, res, 'error/index', options);
    }
}