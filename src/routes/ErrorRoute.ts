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
        DHLog.d("[" + this.name + ":create] " + DHAPI.ERROR_PATH);
        router.get(DHAPI.ERROR_PATH + "/:errorCode", (req: Request, res: Response, next: NextFunction) => {
            var errorCode = req.params.errorCode;
            DHLog.d("error code " + errorCode);
            if (!errorCode) {
                var result = BaseRoute.createResult(null, CONNECTION_CODE.CC_PARAMETER_ERROR);
                new ErrorRoute().error(req, res, next, result);
            }else {
                var result = BaseRoute.createResult(null, parseInt(errorCode));
                new ErrorRoute().error(req, res, next, result);
            }
        });
    }
    
    public error(req: Request, res: Response, next: NextFunction, result: IResult) {
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