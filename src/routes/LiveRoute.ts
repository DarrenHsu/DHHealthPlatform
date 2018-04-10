import * as mongoose from "mongoose";
import * as querystring from "querystring";
import * as google from "google-auth-library";
import * as request from "request";
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
import { urlencoded } from "body-parser";

export class LiveRoute extends BaseRoute {
    
    private userHelper: UserHelper;
    private recordHelper: RecordHelper;
    private authHelper: AuthHelper;
    
    private oauth2Client: google.OAuth2Client;

    private scopes: string[];
    
    private clientId: string;
    private clientSecret: string;
    
    constructor(connection: mongoose.Connection) {
        super();

        this.recordHelper = new RecordHelper(connection);
        this.userHelper = new UserHelper(connection);
        this.authHelper = new AuthHelper(connection);
        this.clientId = DHAPI.pkgjson.googleapis.auth.client_id;
        this.clientSecret = DHAPI.pkgjson.googleapis.auth.client_secret;
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

    /**
     * @description 產生OAuth2Client物件
     * @param req 
     */
    private initOAuth2Client(req: Request) {
        if (!this.oauth2Client) {
            var fullUrl = BaseRoute.getFullHostUrl(req);
            var redirectUrl = fullUrl + GoogleAPI.API_GOOGLE_AUTH_PATH;
            
            this.oauth2Client = new google.OAuth2Client(
                this.clientId,
                this.clientSecret,
                redirectUrl
            );
        }
    }

    /**
     * @description 建立 youtube 授權 headers
     * @param token 
     */
    private createAuthHeader(token: string): any {
        var option = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        };
        return option;
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

                this.authHelper.findOne(req.session.account, (code, auth) =>{
                    if (auth) {
                        auth.googleToken = token.access_token;
                        auth.googleTokenExpire = new Date(token.expiry_date);
                        
                        /* update auth */
                        this.authHelper.save(auth._id, auth, (code, auth) => {
                            this.getYTBroadcastList(auth.googleToken, req, res, next);
                        });
                    }else {
                        this.initOAuth2Client(req);

                        var newAuth: IAuth = {
                            lineUserId: req.session.account,
                            googleToken: token.access_token,
                            googleTokenExpire: new Date(token.expiry_date),
                            lineToken: null,
                            lineTokenExpire: null
                        };

                        /* create auth */
                        this.authHelper.add(newAuth, (code, auth) => {
                            this.getYTBroadcastList(auth.googleToken, req, res, next);
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
                    // var start = req.params.start;
                    // var end = req.params.end;
                    // if (!start && !end) {
                    //     return res.redirect(DHAPI.ERROR_PATH + "/" + CONNECTION_CODE.CC_PARAMETER_ERROR);
                    // }

                    var now = new Date();
                    if (now > auth.googleTokenExpire) {
                        this.redirectGoogleAuth(req, res, next);
                    }else {
                        this.getYTBroadcastList(auth.googleToken, req, res, next);
                    }
                }else {
                    this.redirectGoogleAuth(req, res, next);
                }
            });
        });
    }

    /**
     * @description 重新導向到 google 登入頁
     * @param req 
     * @param res 
     * @param next 
     */
    private redirectGoogleAuth(req: Request, res: Response, next: NextFunction) {
        this.initOAuth2Client(req);
            
        const url = this.oauth2Client.generateAuthUrl({
            access_type: "offline",
            scope: this.scopes
        });

        return res.redirect(url);
    }

    /**
     * @description
     * @param token 
     * @param req 
     * @param res 
     * @param next 
     */
    private getYTBroadcastList(token: string, req: Request, res: Response, next: NextFunction) {
        var url = GoogleAPI.API_YOUTUBE + 
        "?key=" + this.clientId + 
        "&part=" + querystring.escape("id,snippet,contentDetails,status") + 
        "&maxResults=10" + 
        "&broadcastStatus=all";  

        request.get(url, this.createAuthHeader(token),  (error, response, body) => {
            if (error) {
                DHLog.d("youtube error " + error);
                return res.redirect(DHAPI.ERROR_PATH + "/" + GOOGLE_CODE.GC_YT_ERROR);
            }else {
                DHLog.d("body " + body.pageInfo.totalResults);
                DHLog.d("body " + body.pageInfo.resultsPerPage);
                return this.renderLive(req, res, next, null);
            }     
        });
    }

    public renderLive(req: Request, res: Response, next: NextFunction, recds: IRecord[]) {
        this.title = BaseRoute.AP_TITLE;
        let options: Object = {
            auth: this.getAuth(req, DHAPI.LIVE_PATH, true),
            records: recds
        };
        this.render(req, res, "live/index", options);
    }
}