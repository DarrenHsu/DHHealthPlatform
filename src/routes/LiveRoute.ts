import * as mongoose from 'mongoose';
import * as querystring from 'querystring';
import { NextFunction, Request, Response, Router } from 'express';
import * as google from 'google-auth-library';
import Axios from 'axios';

import { GOOGLE_CODE } from './ResultCode';

import { BaseRoute }        from './BaseRoute';

import { DHAPI }            from '../const/DHAPI';
import { GoogleAPI }        from '../const/GoogleAPI';
import { DHLog }            from '../util/DHLog';

import { DBHelper }         from '../mongo/helper/DBHelper';
import { AuthHelper }       from '../mongo/helper/AuthHelper';
import { IAuth }            from '../mongo/interface/IAuth';

/**
 * @description 直播路由控制
 */
export class LiveRoute extends BaseRoute {
    
    private authHelper: AuthHelper;
    
    private oauth2Client: google.OAuth2Client;

    private scopes: string[];
    
    private clientId: string;
    private clientSecret: string;
    
    constructor(connection: mongoose.Connection) {
        super();

        this.authHelper = new AuthHelper(connection);
        this.clientId = DHAPI.pkgjson.googleapis.auth.client_id;
        this.clientSecret = DHAPI.pkgjson.googleapis.auth.client_secret;
        this.scopes = [
            'https://www.googleapis.com/auth/youtube',
            'https://www.googleapis.com/auth/youtube.force-ssl',
            'https://www.googleapis.com/auth/youtube.upload',
            'https://www.googleapis.com/auth/youtubepartner',
            'https://www.googleapis.com/auth/youtubepartner-channel-audit',
            'https://www.googleapis.com/auth/youtube.readonly'
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
                Authorization: 'Bearer ' + token
            }
        };
        return option;
    }

    /**
     * @description 取得回傳授權資料
     * @param router 
     */
    public getGoogleAuth(router: Router) {
        DHLog.d('[' + LiveRoute.name + ':create] ' + GoogleAPI.API_GOOGLE_AUTH_PATH);
        router.get(GoogleAPI.API_GOOGLE_AUTH_PATH, (req, res, next) => {
            if (!this.checkLogin(req, res, next)) return;

            this.oauth2Client.getToken(req.query.code).then((value) => {
                if (!value) return res.redirect(DHAPI.ERROR_PATH + '/' + GOOGLE_CODE.GC_TOKEN_ERROR);
                
                this.authHelper.findOne(req.session.account, (code, auth) =>{
                    if (auth) {
                        auth.googleToken = value.tokens.access_token;
                        auth.googleTokenExpire = new Date(value.tokens.expiry_date);
                        
                        this.authHelper.save(auth._id, auth, (code, auth) => {
                            this.getYTBroadcastList(auth.googleToken, req, res, next);
                        });
                        return;
                    }
                        
                    this.initOAuth2Client(req);

                    var newAuth: IAuth = {
                        lineUserId: req.session.account,
                        googleToken: value.tokens.access_token,
                        googleTokenExpire: new Date(value.tokens.expiry_date),
                        lineToken: null,
                        lineTokenExpire: null
                    };

                    this.authHelper.add(newAuth, (code, auth) => {
                        this.getYTBroadcastList(auth.googleToken, req, res, next);
                    });
                });
            }).catch((err) => {
                DHLog.d('' + err);
                return res.redirect(DHAPI.ERROR_PATH + '/' + GOOGLE_CODE.GC_AUTH_ERROR);
            });
        });
    }

    /**
     * @description 取得 youtube list
     * @param router 
     */
    public getLive(router: Router) {
        DHLog.d('[' + LiveRoute.name + ':create] ' + DHAPI.LIVE_PATH);
        router.get(DHAPI.LIVE_PATH, (req, res, next) => {
            if (!this.checkLogin(req, res, next)) return;

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
        DHLog.d('[' + LiveRoute.name + ':create] ' + DHAPI.LIVE_PATH);
        router.get(DHAPI.LIVE_PATH + '/:pageToken', (req, res, next) => {
            if (!this.checkLogin(req, res, next)) return;
            
            req.session.ytPageToken = req.params.pageToken;
            req.session.ytIndex = req.query.index ? req.query.index : 0;

            this.doAuthAndList(req, res, next);
        });
    }

    private doAuthAndList(req: Request, res: Response, next: NextFunction) {
        this.authHelper.findOne(req.session.account, (code, auth) => {
            if (!auth) return this.redirectGoogleAuth(req, res, next);
        
            var now = new Date();
            if (now > auth.googleTokenExpire) {
                this.redirectGoogleAuth(req, res, next);
            }else {
                this.getYTBroadcastList(auth.googleToken, req, res, next);
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
            access_type: 'offline',
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
        '?key=' + this.clientId + 
        '&part=' + querystring.escape('id,snippet,contentDetails,status') + 
        '&maxResults=6' + 
        '&broadcastStatus=all';

        if (ytPageToken) {
            DHLog.d('ytPageToken ' + ytPageToken);
            url += '&pageToken=' + ytPageToken;
        }
        
        Axios.get(url, this.createAuthHeader(token)).then((response) => {
            var jsonBody = response.data;
            var items = jsonBody.items;
            var totalResults = jsonBody.pageInfo.totalResults;
            var resultsPerPage = jsonBody.pageInfo.resultsPerPage;
            var prevPageToken = jsonBody.prevPageToken;
            var nextPageToken = jsonBody.nextPageToken;
            return this.renderLive(req, res, next, items, nextPageToken, prevPageToken);
        }).catch((error) => {
            DHLog.d('yt error ' + error);
            return res.redirect(DHAPI.ERROR_PATH + '/' + GOOGLE_CODE.GC_YT_ERROR);
        });
    }

    public renderLive(req: Request, res: Response, next: NextFunction, items: JSON[], nxtToken: string, preToken: string) {
        DHLog.d('video index ' + req.session.ytIndex);
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
        this.render(req, res, 'live/index', options);
    }
}