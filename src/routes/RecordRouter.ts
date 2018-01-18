import mongoose = require("mongoose");
import { NextFunction, Request, Response, Router } from "express";
import { CONNECTION_CODE, MONGODB_CODE, ResultCodeMsg } from "./ResultCode";
import { BaseRoute } from "./BaseRoute";
import { DBHelper } from "../mongo/helper/DBHelper";
import { RecordHelper } from "../mongo/helper/RecordHelper";
import { IRecord } from "../mongo/interface/IRecord";
import { DHAPI } from "../const/Path";
import { DHLog } from "../util/DHLog";

export class RecordRouter extends BaseRoute {

    protected helper: RecordHelper;
    protected uri = DHAPI.RECORD_PATH;
    
    public static create(router: Router) {
        var app = new RecordRouter(DBHelper.connection);
        DHLog.d("[" + this.name + ":create] " + app.uri);
        
        app.get(router);
    }

    constructor(connection: mongoose.Connection) {
        super();
        this.helper = new RecordHelper(connection);
    }

    public get(router: Router) {
        router.get(DHAPI.RECORD_PATH + "/:id/:verify/:auth", (req: Request, res: Response, next: NextFunction) => {
            if (req.params.id == null || req.params.verify == null || req.params.auth == null) {
                res.json(BaseRoute.createResult(null, CONNECTION_CODE.CC_PARAMETER_ERROR));
                return;
            }

            if (!this.checkParam(req.params.auth, req.params.verify)) {
                res.statusCode = 403;
                res.json(BaseRoute.createResult(null, CONNECTION_CODE.CC_AUTH_ERROR));
                return;
            }
            
            this.helper.get(req.params.id, (code, result) => {
                this.index(req, res, next, result);
            });
        });
    }

    public index(req: Request, res: Response, next: NextFunction, record: IRecord) {
        this.title = "Home | DHHealthPlatform | record";
        let options: Object = {
            "message": "Welcome to the Record",
            "data": record
        };
        this.render(req, res, "record", options);
    }
}