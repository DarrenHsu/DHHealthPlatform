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
        DHLog.d("[" + this.name + ":create] " + app.uri);
        var app = new RecordRouter(DBHelper.connection);

        app.get(router);
    }

    constructor(connection: mongoose.Connection) {
        super();
        this.helper = new RecordHelper(connection);
    }

    public get(router: Router) {
        router.get(DHAPI.RECORD_PATH + "/:id/:auth", (req: Request, res: Response, next: NextFunction) => {
            var recordid = req.params.id;
            var auth = req.params.auth;

            if (!this.checkParam(auth, recordid)) {
                res.statusCode = 403;
                res.json(BaseRoute.createResult(null, CONNECTION_CODE.CC_AUTH_ERROR));
                return;
            }

            this.index(req, res, next);
        });
    }

    public index(req: Request, res: Response, next: NextFunction) {
        this.title = "Home | DHHealthPlatform | record";
        let options: Object = {
            "message": "Welcome to the Record"
        };
        this.render(req, res, "record", options);
    }
}