"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const querystring = require("querystring");
const google = require("google-auth-library");
const axios_1 = require("axios");
const ResultCode_1 = require("./ResultCode");
const BaseRoute_1 = require("./BaseRoute");
const DHAPI_1 = require("../const/DHAPI");
const GoogleAPI_1 = require("../const/GoogleAPI");
const DHLog_1 = require("../util/DHLog");
const DBHelper_1 = require("../mongo/helper/DBHelper");
const RecordHelper_1 = require("../mongo/helper/RecordHelper");
const UserHelper_1 = require("../mongo/helper/UserHelper");
const AuthHelper_1 = require("../mongo/helper/AuthHelper");
/**
 * @description 直播路由控制
 */
class LiveRoute extends BaseRoute_1.BaseRoute {
    constructor(connection) {
        super();
        this.recordHelper = new RecordHelper_1.RecordHelper(connection);
        this.userHelper = new UserHelper_1.UserHelper(connection);
        this.authHelper = new AuthHelper_1.AuthHelper(connection);
        this.clientId = DHAPI_1.DHAPI.pkgjson.googleapis.auth.client_id;
        this.clientSecret = DHAPI_1.DHAPI.pkgjson.googleapis.auth.client_secret;
        this.scopes = [
            'https://www.googleapis.com/auth/youtube',
            'https://www.googleapis.com/auth/youtube.force-ssl',
            'https://www.googleapis.com/auth/youtube.upload',
            'https://www.googleapis.com/auth/youtubepartner',
            'https://www.googleapis.com/auth/youtubepartner-channel-audit',
            'https://www.googleapis.com/auth/youtube.readonly'
        ];
    }
    static create(router) {
        var app = new LiveRoute(DBHelper_1.DBHelper.connection);
        app.getLive(router);
        app.getListWithToken(router);
        app.getGoogleAuth(router);
    }
    /**
     * @description 產生OAuth2Client物件
     * @param req
     */
    initOAuth2Client(req) {
        if (!this.oauth2Client) {
            var fullUrl = BaseRoute_1.BaseRoute.getFullHostUrl(req);
            var redirectUrl = fullUrl + GoogleAPI_1.GoogleAPI.API_GOOGLE_AUTH_PATH;
            this.oauth2Client = new google.OAuth2Client(this.clientId, this.clientSecret, redirectUrl);
        }
    }
    /**
     * @description 建立 youtube 授權 headers
     * @param token
     */
    createAuthHeader(token) {
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
    getGoogleAuth(router) {
        DHLog_1.DHLog.d('[' + LiveRoute.name + ':create] ' + GoogleAPI_1.GoogleAPI.API_GOOGLE_AUTH_PATH);
        router.get(GoogleAPI_1.GoogleAPI.API_GOOGLE_AUTH_PATH, (req, res, next) => {
            if (!this.checkLogin(req, res, next))
                return;
            this.oauth2Client.getToken(req.query.code).then((value) => {
                if (!value)
                    return res.redirect(DHAPI_1.DHAPI.ERROR_PATH + '/' + ResultCode_1.GOOGLE_CODE.GC_TOKEN_ERROR);
                this.authHelper.findOne(req.session.account, (code, auth) => {
                    if (auth) {
                        auth.googleToken = value.tokens.access_token;
                        auth.googleTokenExpire = new Date(value.tokens.expiry_date);
                        this.authHelper.save(auth._id, auth, (code, auth) => {
                            this.getYTBroadcastList(auth.googleToken, req, res, next);
                        });
                        return;
                    }
                    this.initOAuth2Client(req);
                    var newAuth = {
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
                DHLog_1.DHLog.d('' + err);
                return res.redirect(DHAPI_1.DHAPI.ERROR_PATH + '/' + ResultCode_1.GOOGLE_CODE.GC_AUTH_ERROR);
            });
        });
    }
    /**
     * @description 取得 youtube list
     * @param router
     */
    getLive(router) {
        DHLog_1.DHLog.d('[' + LiveRoute.name + ':create] ' + DHAPI_1.DHAPI.LIVE_PATH);
        router.get(DHAPI_1.DHAPI.LIVE_PATH, (req, res, next) => {
            if (!this.checkLogin(req, res, next))
                return;
            req.session.ytPageToken = null;
            req.session.ytIndex = req.query.index ? req.query.index : 0;
            this.doAuthAndList(req, res, next);
        });
    }
    /**
     * @description 取得 youtube list 含 page token
     * @param router
     */
    getListWithToken(router) {
        DHLog_1.DHLog.d('[' + LiveRoute.name + ':create] ' + DHAPI_1.DHAPI.LIVE_PATH);
        router.get(DHAPI_1.DHAPI.LIVE_PATH + '/:pageToken', (req, res, next) => {
            if (!this.checkLogin(req, res, next))
                return;
            req.session.ytPageToken = req.params.pageToken;
            req.session.ytIndex = req.query.index ? req.query.index : 0;
            this.doAuthAndList(req, res, next);
        });
    }
    doAuthAndList(req, res, next) {
        this.authHelper.findOne(req.session.account, (code, auth) => {
            if (!auth)
                return this.redirectGoogleAuth(req, res, next);
            var now = new Date();
            if (now > auth.googleTokenExpire) {
                this.redirectGoogleAuth(req, res, next);
            }
            else {
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
    redirectGoogleAuth(req, res, next) {
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
    getYTBroadcastList(token, req, res, next) {
        var ytPageToken = req.session.ytPageToken;
        var url = GoogleAPI_1.GoogleAPI.API_YOUTUBE +
            '?key=' + this.clientId +
            '&part=' + querystring.escape('id,snippet,contentDetails,status') +
            '&maxResults=6' +
            '&broadcastStatus=all';
        if (ytPageToken) {
            DHLog_1.DHLog.d('ytPageToken ' + ytPageToken);
            url += '&pageToken=' + ytPageToken;
        }
        axios_1.default.get(url, this.createAuthHeader(token)).then((response) => {
            var jsonBody = response.data;
            var items = jsonBody.items;
            var totalResults = jsonBody.pageInfo.totalResults;
            var resultsPerPage = jsonBody.pageInfo.resultsPerPage;
            var prevPageToken = jsonBody.prevPageToken;
            var nextPageToken = jsonBody.nextPageToken;
            return this.renderLive(req, res, next, items, nextPageToken, prevPageToken);
        }).catch((error) => {
            DHLog_1.DHLog.d('yt error ' + error);
            return res.redirect(DHAPI_1.DHAPI.ERROR_PATH + '/' + ResultCode_1.GOOGLE_CODE.GC_YT_ERROR);
        });
    }
    renderLive(req, res, next, items, nxtToken, preToken) {
        DHLog_1.DHLog.d('video index ' + req.session.ytIndex);
        this.title = BaseRoute_1.BaseRoute.AP_TITLE;
        let options = {
            auth: this.getAuth(req, DHAPI_1.DHAPI.LIVE_PATH, true),
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
exports.LiveRoute = LiveRoute;
