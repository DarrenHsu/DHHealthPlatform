import * as mongoose from "mongoose";
import * as querystring from "querystring";
import * as google from "google-auth-library";
import { DHDateFormat } from "../const/DHDateFormat";
import { parseIso, format } from "ts-date/locale/en";
import { NextFunction, Request, Response, Router } from "express";
import { CONNECTION_CODE, MONGODB_CODE, ResultCodeMsg } from "./ResultCode";
import { DHAPI } from "../const/DHAPI";
import { GoogleAPI } from "../const/GoogleAPI";
import { DHLog } from "../util/DHLog";
import { BaseRoute } from "./BaseRoute";
import { DBHelper } from "../mongo/helper/DBHelper";
import { RecordHelper } from "../mongo/helper/RecordHelper";
import { UserHelper } from "../mongo/helper/UserHelper";
import { IRecord } from "../mongo/interface/IRecord";
import { IUser } from "../mongo/interface/IUser";

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
        app.getGoogleAuth(router);
    }

    public getGoogleAuth(router: Router) {
        DHLog.d("[" + LiveRoute.name + ":create] " + GoogleAPI.API_GOOGLE_AUTH_PATH);
        router.get(GoogleAPI.API_GOOGLE_AUTH_PATH, (req: Request, res: Response, next: NextFunction) => {
            DHLog.d("google auth");
        });
    }

    /**
     * @description 顯示紀錄頁面
     * @param router 
     */
    public getLive(router: Router) {
        DHLog.d("[" + LiveRoute.name + ":create] " + DHAPI.LIVE_PATH);
        router.get(DHAPI.LIVE_PATH + "/:start/:end", (req: Request, res: Response, next: NextFunction) => {
            if (!this.checkLogin(req, res, next)) {
                return;
            }

            
            var fullUrl = BaseRoute.getFullHostUrl(req);
            var redirectUrl = fullUrl + GoogleAPI.API_GOOGLE_AUTH_PATH;
            var client_id = DHAPI.pkgjson.googleapis.auth.client_id;
            var client_secret = DHAPI.pkgjson.googleapis.auth.client_secret;

            DHLog.d("redirectUrl " + redirectUrl);
            DHLog.d("client_id " + client_id);
            DHLog.d("client_secret " + client_secret);

            const oauth2Client = new google.OAuth2Client(
                client_id,
                client_secret,
                redirectUrl
            );

            const scopes = [
                "https://www.googleapis.com/auth/youtube",
                "https://www.googleapis.com/auth/youtube.force-ssl",
                "https://www.googleapis.com/auth/youtube.upload",
                "https://www.googleapis.com/auth/youtubepartner",
                "https://www.googleapis.com/auth/youtubepartner-channel-audit",
                "https://www.googleapis.com/auth/youtube.readonly"
            ];
            
            const url = oauth2Client.generateAuthUrl({
                access_type: "offline",
                scope: scopes
            })

            res.redirect(url);

            // var start = req.params.start;
            // var end = req.params.end;
            // if (!start && !end) {
            //     return res.redirect(DHAPI.ERROR_PATH + "/" + CONNECTION_CODE.CC_PARAMETER_ERROR);
            // }

            // this.renderLive(req, res, next, null);
        });
    }x

    public renderLive(req: Request, res: Response, next: NextFunction, recds: IRecord[]) {
        this.title = BaseRoute.AP_TITLE;
        let options: Object = {
            auth: this.getAuth(req, DHAPI.LIVE_PATH, true),
            records: recds
        };
        this.render(req, res, "live/index", options);
    }
}