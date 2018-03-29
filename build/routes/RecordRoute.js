"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const querystring = require("querystring");
const DHDateFormat_1 = require("../const/DHDateFormat");
const en_1 = require("ts-date/locale/en");
const ResultCode_1 = require("./ResultCode");
const BaseRoute_1 = require("./BaseRoute");
const DBHelper_1 = require("../mongo/helper/DBHelper");
const RecordHelper_1 = require("../mongo/helper/RecordHelper");
const UserHelper_1 = require("../mongo/helper/UserHelper");
const DHAPI_1 = require("../const/DHAPI");
const DHLog_1 = require("../util/DHLog");
class RecordRoute extends BaseRoute_1.BaseRoute {
    constructor(connection) {
        super();
        this.uri = DHAPI_1.DHAPI.RECORD_PATH;
        this.recordHelper = new RecordHelper_1.RecordHelper(connection);
        this.userHelper = new UserHelper_1.UserHelper(connection);
    }
    static create(router) {
        var app = new RecordRoute(DBHelper_1.DBHelper.connection);
        app.getPreviewRecord(router);
        app.getRecord(router);
    }
    /**
     * @description 顯示紀錄頁面
     * @param router
     */
    getRecord(router) {
        DHLog_1.DHLog.d("[" + RecordRoute.name + ":create] " + DHAPI_1.DHAPI.RECORD_PATH);
        router.get(DHAPI_1.DHAPI.RECORD_PATH + "/:start/:end", (req, res, next) => {
            var start = req.params.start;
            var end = req.params.end;
            if (!start && !end) {
                return res.redirect(DHAPI_1.DHAPI.ERROR_PATH + "/" + ResultCode_1.CONNECTION_CODE.CC_PARAMETER_ERROR);
            }
            this.renderRecord(req, res, next, null);
        });
    }
    /**
     * @description 取得紀錄並顯示單筆紀錄祥細內容
     * @param router
     */
    getPreviewRecord(router) {
        DHLog_1.DHLog.d("[" + RecordRoute.name + ":create] " + DHAPI_1.DHAPI.RECORD_PREVIEW_PATH);
        router.get(DHAPI_1.DHAPI.RECORD_PREVIEW_PATH + "/:id/:auth", (req, res, next) => {
            if (req.params.id == null || req.params.auth == null) {
                return res.redirect(DHAPI_1.DHAPI.ERROR_PATH + "/" + ResultCode_1.CONNECTION_CODE.CC_PARAMETER_ERROR);
            }
            let recordId = querystring.unescape(req.params.id);
            let auth = querystring.unescape(req.params.auth);
            if (!this.checkParam(auth, recordId)) {
                return res.redirect(DHAPI_1.DHAPI.ERROR_PATH + "/" + ResultCode_1.CONNECTION_CODE.CC_AUTH_ERROR);
            }
            this.recordHelper.get(recordId, (code, record) => {
                if (code != ResultCode_1.MONGODB_CODE.MC_SUCCESS) {
                    return res.redirect(DHAPI_1.DHAPI.ERROR_PATH + "/" + code);
                }
                this.userHelper.list(record.lineUserId, (code, user) => {
                    this.renderPreviewRecord(req, res, next, user[0], record);
                });
            });
        });
    }
    renderRecord(req, res, next, recds) {
        this.title = BaseRoute_1.BaseRoute.AP_TITLE;
        let options = {
            auth: {
                path: DHAPI_1.DHAPI.RECORD_PATH,
                checkLogin: true
            },
            records: recds
        };
        this.render(req, res, "record/index", options);
    }
    renderPreviewRecord(req, res, next, user, record) {
        this.title = BaseRoute_1.BaseRoute.AP_TITLE;
        var dateStr = en_1.format(record.startTime, DHDateFormat_1.DHDateFormat.DATE_FORMAT);
        var startTimeStr = en_1.format(record.startTime, DHDateFormat_1.DHDateFormat.TIME_FORMAT);
        var endTimeStr = en_1.format(record.endTime, DHDateFormat_1.DHDateFormat.TIME_FORMAT);
        let options = {
            auth: {
                path: DHAPI_1.DHAPI.RECORD_PATH,
                checkLogin: false
            },
            user: user.name,
            pictureUrl: user.pictureUrl,
            name: record.name,
            locality: record.locality,
            dateStr: dateStr,
            startTimeStr: startTimeStr,
            endTimeStr: endTimeStr,
            distance: record.distance.toFixed(1),
            maxSpeed: record.maxSpeed.toFixed(1),
            avgSpeed: record.avgSpeed.toFixed(1),
            locations: record.locations
        };
        this.render(req, res, "record/publicIndex", options);
    }
}
exports.RecordRoute = RecordRoute;
