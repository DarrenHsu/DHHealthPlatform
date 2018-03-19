import mongoose = require("mongoose");
import querystring = require("querystring");
import { parseIso, format } from "ts-date/locale/en";
import { NextFunction, Request, Response, Router } from "express";
import { CONNECTION_CODE, MONGODB_CODE, ResultCodeMsg } from "./ResultCode";
import { BaseRoute } from "./BaseRoute";
import { DBHelper } from "../mongo/helper/DBHelper";
import { RecordHelper } from "../mongo/helper/RecordHelper";
import { UserHelper } from "../mongo/helper/UserHelper";
import { IRecord } from "../mongo/interface/IRecord";
import { DHAPI } from "../const/DHAPI";
import { DHDateFormat } from "../const/DHDateFormat";
import { DHLog } from "../util/DHLog";
import { IUser } from "../mongo/interface/IUser";

declare type Location = {
    lat: string;
    lng: string;
};

export class RecordRouter extends BaseRoute {

    protected userHelper: UserHelper;
    protected recordHelper: RecordHelper;
    protected uri = DHAPI.RECORD_PATH;
    
    constructor(connection: mongoose.Connection) {
        super();
        this.recordHelper = new RecordHelper(connection);
        this.userHelper = new UserHelper(connection);
    }
    
    public static create(router: Router) {
        var app = new RecordRouter(DBHelper.connection);
        DHLog.d("[" + this.name + ":create] " + app.uri);
        
        app.get(router);
    }

    /**
     * @description 取得紀錄並顯示單筆紀錄祥細內容
     * @param router 
     */
    public get(router: Router) {
        router.get(DHAPI.RECORD_PATH + "/:id/:auth", (req: Request, res: Response, next: NextFunction) => {
            if (req.params.id == null || req.params.auth == null) {
                res.json(BaseRoute.createResult(null, CONNECTION_CODE.CC_PARAMETER_ERROR));
                return;
            }

            let recordId = querystring.unescape(req.params.id);
            let auth = querystring.unescape(req.params.auth);
            
            if (!this.checkParam(auth, recordId)) {
                res.statusCode = 403;
                res.json(BaseRoute.createResult(null, CONNECTION_CODE.CC_AUTH_ERROR));
                return;
            }
            
            this.recordHelper.get(recordId, (code, record) => {
                if (code != MONGODB_CODE.MC_SUCCESS) {
                    res.json(BaseRoute.createResult(null, code));
                    return;
                }

                this.userHelper.list(record.lineUserId, (code, user) => {
                    this.index(req, res, next, user[0], record);
                });
            });
        });
    }

    public index(req: Request, res: Response, next: NextFunction, user: IUser, record: IRecord) {
        this.title = "DHHealthPlatform";
        var dateStr = format(record.startTime, DHDateFormat.DATE_FORMAT);
        var startTimeStr = format(record.startTime, DHDateFormat.TIME_FORMAT);
        var endTimeStr = format(record.endTime, DHDateFormat.TIME_FORMAT);
        let options: Object = {
            "user": user.name,
            "pictureUrl": user.pictureUrl,
            "name": record.name,
            "locality": record.locality,
            "dateStr": dateStr,
            "startTimeStr": startTimeStr,
            "endTimeStr": endTimeStr,
            "distance": record.distance.toFixed(1),
            "maxSpeed": record.maxSpeed.toFixed(1),
            "avgSpeed": record.avgSpeed.toFixed(1),
            "locations": record.locations
        };
        this.render(req, res, "record/index", options);
    }
}