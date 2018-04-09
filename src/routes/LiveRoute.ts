import * as mongoose from "mongoose";
import * as querystring from "querystring";
import * as google from "google-auth-library";
import { DHDateFormat } from "../const/DHDateFormat";
import { parseIso, format } from "ts-date/locale/en";
import { NextFunction, Request, Response, Router } from "express";
import { CONNECTION_CODE, MONGODB_CODE, ResultCodeMsg, GOOGLE_CODE } from "./ResultCode";
import { DHAPI } from "../const/DHAPI";
import { GoogleAPI } from "../const/GoogleAPI";
import { DHLog } from "../util/DHLog";
import { BaseRoute } from "./BaseRoute";
import { DBHelper } from "../mongo/helper/DBHelper";
import { RecordHelper } from "../mongo/helper/RecordHelper";
import { UserHelper } from "../mongo/helper/UserHelper";
import { AuthHelper } from "../mongo/helper/AuthHelper";
import { IRecord } from "../mongo/interface/IRecord";
import { IUser } from "../mongo/interface/IUser";
import { IAuth } from "../mongo/interface/IAuth";

export class LiveRoute extends BaseRoute {
    
    protected userHelper: UserHelper;
    protected recordHelper: RecordHelper;
    protected authHelper: AuthHelper;
    protected uri = DHAPI.RECORD_PATH;

    private oauth2Client: google.OAuth2Client;
    private scopes: [string, string, string, string, string, string];
    
    constructor(connection: mongoose.Connection) {
        super();

        this.recordHelper = new RecordHelper(connection);
        this.userHelper = new UserHelper(connection);
        this.authHelper = new AuthHelper(connection);
        this.scopes = [
            "https://www.googleapis.com/auth/youtube",
            "https://www.googleapis.com/auth/youtube.force-ssl",
            "https://www.googleapis.com/auth/youtube.upload",
            "https://www.googleapis.com/auth/youtubepartner",
            "https://www.googleapis.com/auth/youtubepartner-channel-audit",
            "https://www.googleapis.com/auth/youtube.readonly"
        ];
    }
    
    public static create(router: Router) {
        var app = new LiveRoute(DBHelper.connection);
        
        app.getLive(router);
        app.getGoogleAuth(router);
    }

    private initOAuth2Client(req: Request) {
        if (!this.oauth2Client) {
            var fullUrl = BaseRoute.getFullHostUrl(req);
            var redirectUrl = fullUrl + GoogleAPI.API_GOOGLE_AUTH_PATH;
            var client_id = DHAPI.pkgjson.googleapis.auth.client_id;
            var client_secret = DHAPI.pkgjson.googleapis.auth.client_secret;

            DHLog.d("redirectUrl " + redirectUrl);
            DHLog.d("client_id " + client_id);
            DHLog.d("client_secret " + client_secret);

            this.oauth2Client = new google.OAuth2Client(
                client_id,
                client_secret,
                redirectUrl
            );
        }
    }

    /**
     * @description 取得回傳授權資料
     * @param router 
     */
    public getGoogleAuth(router: Router) {
        DHLog.d("[" + LiveRoute.name + ":create] " + GoogleAPI.API_GOOGLE_AUTH_PATH);
        router.get(GoogleAPI.API_GOOGLE_AUTH_PATH, (req: Request, res: Response, next: NextFunction) => {
            if (!this.checkLogin(req, res, next)) {
                return;
            }

            this.oauth2Client.getToken(req.query.code, (err, token) => {
                if (err) {
                    DHLog.d("" + err);
                    return res.redirect(DHAPI.ERROR_PATH + "/" + GOOGLE_CODE.GC_AUTH_ERROR);
                }

                if (!token) {
                    return res.redirect(DHAPI.ERROR_PATH + "/" + GOOGLE_CODE.GC_TOKEN_ERROR);
                }

                DHLog.d("get token " + token.access_token);
                DHLog.d("get token " + token.expiry_date);

                this.authHelper.findOne(req.session.account, (code, auth) =>{
                    if (auth) {
                        auth.googleToken = token.access_token;
                        auth.googleTokenExpire = new Date(token.expiry_date);
                        
                        DHLog.d("token " + auth.googleToken);
                        DHLog.d("token " + auth.googleTokenExpire);
                        return this.renderLive(req, res, next, null);
                    }else {
                        this.initOAuth2Client(req);

                        var newAuth: IAuth = {
                            lineUserId: req.session.account,
                            googleToken: token.access_token,
                            googleTokenExpire: new Date(token.expiry_date),
                            lineToken: null,
                            lineTokenExpire: null
                        };

                        this.authHelper.add(newAuth, (code, auth) => {
                            DHLog.d("token " + auth.googleToken);
                            DHLog.d("token " + auth.googleTokenExpire);
                            return this.renderLive(req, res, next, null);
                        });
                    }
                });
            });
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

            this.authHelper.findOne(req.session.account, (code, auth) =>{
                if (auth) {
                    var start = req.params.start;
                    var end = req.params.end;
                    if (!start && !end) {
                        return res.redirect(DHAPI.ERROR_PATH + "/" + CONNECTION_CODE.CC_PARAMETER_ERROR);
                    }
        
                    this.renderLive(req, res, next, null);
                }else {
                    this.initOAuth2Client(req);
            
                    const url = this.oauth2Client.generateAuthUrl({
                        access_type: "offline",
                        scope: this.scopes
                    });
        
                    return res.redirect(url);
                }
            });
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