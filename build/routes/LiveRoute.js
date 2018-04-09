"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const google = require("google-auth-library");
const ResultCode_1 = require("./ResultCode");
const DHAPI_1 = require("../const/DHAPI");
const GoogleAPI_1 = require("../const/GoogleAPI");
const DHLog_1 = require("../util/DHLog");
const BaseRoute_1 = require("./BaseRoute");
const DBHelper_1 = require("../mongo/helper/DBHelper");
const RecordHelper_1 = require("../mongo/helper/RecordHelper");
const UserHelper_1 = require("../mongo/helper/UserHelper");
class LiveRoute extends BaseRoute_1.BaseRoute {
    constructor(connection) {
        super();
        this.uri = DHAPI_1.DHAPI.RECORD_PATH;
        this.recordHelper = new RecordHelper_1.RecordHelper(connection);
        this.userHelper = new UserHelper_1.UserHelper(connection);
    }
    static create(router) {
        var app = new LiveRoute(DBHelper_1.DBHelper.connection);
        app.getLive(router);
        app.getGoogleAuth(router);
    }
    getGoogleAuth(router) {
        DHLog_1.DHLog.d("[" + LiveRoute.name + ":create] " + GoogleAPI_1.GoogleAPI.API_GOOGLE_AUTH_PATH);
        router.get(GoogleAPI_1.GoogleAPI.API_GOOGLE_AUTH_PATH + "/:start/:end", (req, res, next) => {
            DHLog_1.DHLog.d("google auth");
        });
    }
    /**
     * @description 顯示紀錄頁面
     * @param router
     */
    getLive(router) {
        DHLog_1.DHLog.d("[" + LiveRoute.name + ":create] " + DHAPI_1.DHAPI.LIVE_PATH);
        router.get(DHAPI_1.DHAPI.LIVE_PATH + "/:start/:end", (req, res, next) => {
            if (!this.checkLogin(req, res, next)) {
                return;
            }
            var fullUrl = BaseRoute_1.BaseRoute.getFullHostUrl(req);
            var redirectUrl = fullUrl + GoogleAPI_1.GoogleAPI.API_GOOGLE_AUTH_PATH;
            var client_id = DHAPI_1.DHAPI.pkgjson.googleapis.auth.client_id;
            var client_secret = DHAPI_1.DHAPI.pkgjson.googleapis.auth.client_secret;
            DHLog_1.DHLog.d("redirectUrl " + redirectUrl);
            DHLog_1.DHLog.d("client_id " + client_id);
            DHLog_1.DHLog.d("client_secret " + client_secret);
            const oauth2Client = new google.OAuth2Client(client_id, client_secret, redirectUrl);
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
            });
            var start = req.params.start;
            var end = req.params.end;
            if (!start && !end) {
                return res.redirect(DHAPI_1.DHAPI.ERROR_PATH + "/" + ResultCode_1.CONNECTION_CODE.CC_PARAMETER_ERROR);
            }
            this.renderLive(req, res, next, null);
        });
    }
    renderLive(req, res, next, recds) {
        this.title = BaseRoute_1.BaseRoute.AP_TITLE;
        let options = {
            auth: this.getAuth(req, DHAPI_1.DHAPI.LIVE_PATH, true),
            records: recds
        };
        this.render(req, res, "live/index", options);
    }
}
exports.LiveRoute = LiveRoute;
