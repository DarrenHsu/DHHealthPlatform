import mongoose = require("mongoose");
import querystring = require("querystring");
import { DHDateFormat } from "../const/DHDateFormat";
import { parseIso, format } from "ts-date/locale/en";
import { NextFunction, Request, Response, Router } from "express";
import { CONNECTION_CODE, MONGODB_CODE, ResultCodeMsg } from "./ResultCode";
import { BaseRoute } from "./BaseRoute";
import { DBHelper } from "../mongo/helper/DBHelper";
import { RecordHelper } from "../mongo/helper/RecordHelper";
import { UserHelper } from "../mongo/helper/UserHelper";
import { IRecord } from "../mongo/interface/IRecord";
import { IUser } from "../mongo/interface/IUser";
import { DHAPI } from "../const/DHAPI";
import { DHLog } from "../util/DHLog";

export class LiveRoute extends BaseRoute {

    protected userHelper: UserHelper;
    protected recordHelper: RecordHelper;
    protected uri = DHAPI.RECORD_PATH;
    
    constructor(connection: mongoose.Connection) {
        super();

        this.recordHelper = new RecordHelper(connection);
        this.userHelper = new UserHelper(connection);
    }
    
    public static create(router: Router) {
        var app = new LiveRoute(DBHelper.connection);
        
        app.getLive(router);
    }

    /**
     * @description 顯示紀錄頁面
     * @param router 
     */
    public getLive(router: Router) {
        DHLog.d("[" + LiveRoute.name + ":create] " + DHAPI.LIVE_PATH);
        router.get(DHAPI.LIVE_PATH + "/:start/:end", (req: Request, res: Response, next: NextFunction) => {
            var start = req.params.start;
            var end = req.params.end;
            if (!start && !end) {
                return res.redirect(DHAPI.ERROR_PATH + "/" + CONNECTION_CODE.CC_PARAMETER_ERROR);
            }

            this.renderLive(req, res, next, null);
        });
    }x

    public renderLive(req: Request, res: Response, next: NextFunction, recds: IRecord[]) {
        this.title = BaseRoute.AP_TITLE;
        let options: Object = {
            auth: {
                path: DHAPI.LIVE_PATH,
                checkLogin: true
            },
            records: recds
        };
        this.render(req, res, "live/index", options);
    }
}