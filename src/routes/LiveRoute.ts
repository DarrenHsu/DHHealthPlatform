import * as mongoose from "mongoose";
import * as querystring from "querystring";
import * as bodyParser from "body-parser";
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
import { urlencoded, json } from "body-parser";

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
        app.getListWithToken(router);
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

                        this.authHelper.add(newAuth, (code, auth) => {
                            this.getYTBroadcastList(auth.googleToken, req, res, next);
                        });
                    }
                });
            });
        });
    }

    /**
     * @description 取得 youtube list
     * @param router 
     */
    public getLive(router: Router) {
        DHLog.d("[" + LiveRoute.name + ":create] " + DHAPI.LIVE_PATH);
        router.get(DHAPI.LIVE_PATH, (req: Request, res: Response, next: NextFunction) => {
            if (!this.checkLogin(req, res, next)) {
                return;
            }

            req.session.ytPageToken = null;
            req.session.ytIndex = req.query.index ? req.query.index : 0;

            this.doAuthAndList(req, res, next);
        });
    }

    /**
     * @description 取得 youtube list 含 page token
     * @param router 
     */
    public getListWithToken(router: Router) {
        DHLog.d("[" + LiveRoute.name + ":create] " + DHAPI.LIVE_PATH);
        router.get(DHAPI.LIVE_PATH + "/:pageToken", (req: Request, res: Response, next: NextFunction) => {
            if (!this.checkLogin(req, res, next)) {
                return;
            }

            req.session.ytPageToken = req.params.pageToken;
            req.session.ytIndex = req.query.index ? req.query.index : 0;

            this.doAuthAndList(req, res, next);
        });
    }

    private doAuthAndList(req: Request, res: Response, next: NextFunction) {
        this.authHelper.findOne(req.session.account, (code, auth) => {
            if (auth) {
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
     * @description 取得 youtube broadcast 的列表
     * @param token 
     * @param pageToken 
     * @param req 
     * @param res 
     * @param next 
     */
    private getYTBroadcastList(token: string, req: Request, res: Response, next: NextFunction) {
        var ytPageToken = req.session.ytPageToken;

        var url = GoogleAPI.API_YOUTUBE + 
        "?key=" + this.clientId + 
        "&part=" + querystring.escape("id,snippet,contentDetails,status") + 
        "&maxResults=6" + 
        "&broadcastStatus=all";
        
        if (ytPageToken) {
            DHLog.d("ytPageToken " + ytPageToken);
            url += "&pageToken=" + ytPageToken;
        }

        request.get(url, this.createAuthHeader(token),  (error, response, body) => {
            if (error) {
                DHLog.d("youtube error " + error);
                return res.redirect(DHAPI.ERROR_PATH + "/" + GOOGLE_CODE.GC_YT_ERROR);
            }else {
                var jsonBody = JSON.parse(body);
                var items = jsonBody.items;
                var totalResults = jsonBody.pageInfo.totalResults;
                var resultsPerPage = jsonBody.pageInfo.resultsPerPage;
                var prevPageToken = jsonBody.prevPageToken;
                var nextPageToken = jsonBody.nextPageToken;
                DHLog.d("" + body);
                return this.renderLive(req, res, next, items, nextPageToken, prevPageToken);
            }
        });
    }

    public renderLive(req: Request, res: Response, next: NextFunction, items: JSON[], nxtToken: string, preToken: string) {
        DHLog.d("page index " + req.session.ytIndex);
        DHLog.d("page index " + parseInt(req.session.ytIndex));
        this.title = BaseRoute.AP_TITLE;
        let options: Object = {
            auth: this.getAuth(req, DHAPI.LIVE_PATH, true),
            items: items,
            pageToken: req.session.ytPageToken,
            previous: (preToken ? true : false),
            preToken: preToken,
            next: (nxtToken ? true : false),
            nxtToken: nxtToken,
            playIndex: parseInt(req.session.ytIndex)
        };
        this.render(req, res, "live/index", options);
    }
}