import os = require("os");
import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "./BaseRoute";
import { DHAPI } from "../const/DHAPI";
import { DHLog } from "../util/DHLog";
import { CONNECTION_CODE, MONGODB_CODE, ResultCodeMsg } from "./ResultCode";
import { IResult } from "./interface/IResult";
import { LINEAPI } from "../const/LINEAPI";

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
        DHLog.d("[" + ErrorRoute.name + ":create] " + DHAPI.ERROR_PATH);
        router.get(DHAPI.ERROR_PATH + "/:errorCode", (req: Request, res: Response, next: NextFunction) => {
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
            auth: {
                path: DHAPI.ERROR_PATH,
                checkLogin: false
            },
            result: result
        };
        this.render(req, res, "error/error", options);
    }
}