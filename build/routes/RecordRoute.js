"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const querystring = require("querystring");
const moment = require("moment");
const DHDateFormat_1 = require("../const/DHDateFormat");
const ResultCode_1 = require("./ResultCode");
const BaseRoute_1 = require("./BaseRoute");
const DHAPI_1 = require("../const/DHAPI");
const DHLog_1 = require("../util/DHLog");
const DBHelper_1 = require("../mongo/helper/DBHelper");
const RecordHelper_1 = require("../mongo/helper/RecordHelper");
const UserHelper_1 = require("../mongo/helper/UserHelper");
/**
 * @description 紀錄路由控制
 */
class RecordRoute extends BaseRoute_1.BaseRoute {
    constructor(connection) {
        super();
        this.displayCount = 8;
        this.recordHelper = new RecordHelper_1.RecordHelper(connection);
        this.userHelper = new UserHelper_1.UserHelper(connection);
    }
    static create(router) {
        var app = new RecordRoute(DBHelper_1.DBHelper.connection);
        app.getPreviewRecord(router);
        app.getRecord(router);
        app.delRecord(router);
    }
    delRecord(router) {
        DHLog_1.DHLog.d('[' + RecordRoute.name + ':create] ' + DHAPI_1.DHAPI.RECORD_PATH);
        router.get(DHAPI_1.DHAPI.RECORD_PATH + '/:action/:id/:page', (req, res, next) => {
            if (!this.isCorrectHost(req)) {
                res.redirect("/whatup");
                return;
            }
            if (req.params.action && req.params.action == 'del') {
                this.recordHelper.removeWith({ recordId: req.params.id }, (Code) => {
                    res.redirect('/records/' + req.params.page);
                });
            }
        });
    }
    /**
     * @description 顯示紀錄頁面
     * @param router
     */
    getRecord(router) {
        DHLog_1.DHLog.d('[' + RecordRoute.name + ':create] ' + DHAPI_1.DHAPI.RECORD_PATH);
        router.get(DHAPI_1.DHAPI.RECORD_PATH, (req, res, next) => {
            if (!this.checkLogin(req, res, next)) {
                return;
            }
            this.findRecord(req.session.account, 1, (totalCount, pageCount, pageIndex, results) => {
                this.renderRecord(req, res, next, totalCount, pageCount, pageIndex, results);
            });
        });
        router.get(DHAPI_1.DHAPI.RECORD_PATH + '/:page', (req, res, next) => {
            if (!this.checkLogin(req, res, next)) {
                return;
            }
            var page = req.params.page;
            if (!page || page != parseInt(page, 10)) {
                return res.redirect(DHAPI_1.DHAPI.ERROR_PATH + '/' + ResultCode_1.CONNECTION_CODE.CC_PARAMETER_ERROR);
            }
            this.findRecord(req.session.account, parseInt(page), (totalCount, pageCount, pageIndex, results) => {
                this.renderRecord(req, res, next, totalCount, pageCount, pageIndex, results);
            });
        });
    }
    findRecord(lineUserId, page, callback) {
        this.recordHelper.find(lineUserId, (code, records) => {
            var start = (page - 1) * this.displayCount;
            var end = start + this.displayCount;
            var results = records.slice(start, end);
            var pageCount = Math.ceil(records.length / this.displayCount);
            callback(records.length, pageCount, page, results);
        });
    }
    /**
     * @description 取得紀錄並顯示單筆紀錄祥細內容
     * @param router
     */
    getPreviewRecord(router) {
        DHLog_1.DHLog.d('[' + RecordRoute.name + ':create] ' + DHAPI_1.DHAPI.RECORD_PREVIEW_PATH);
        router.get(DHAPI_1.DHAPI.RECORD_PREVIEW_PATH + '/:id/:auth', (req, res, next) => {
            if (req.params.id == null || req.params.auth == null) {
                return res.redirect(DHAPI_1.DHAPI.ERROR_PATH + '/' + ResultCode_1.CONNECTION_CODE.CC_PARAMETER_ERROR);
            }
            let recordId = querystring.unescape(req.params.id);
            let auth = querystring.unescape(req.params.auth);
            if (!this.checkParam(auth, recordId)) {
                return res.redirect(DHAPI_1.DHAPI.ERROR_PATH + '/' + ResultCode_1.CONNECTION_CODE.CC_AUTH_ERROR);
            }
            this.recordHelper.findOne(recordId, (code, record) => {
                if (code != ResultCode_1.MONGODB_CODE.MC_SUCCESS) {
                    return res.redirect(DHAPI_1.DHAPI.ERROR_PATH + '/' + code);
                }
                this.userHelper.find(record.lineUserId, (code, user) => {
                    this.renderPreviewRecord(req, res, next, user[0], record);
                });
            });
        });
    }
    renderRecord(req, res, next, tCount, pCount, pIndex, recds) {
        this.title = BaseRoute_1.BaseRoute.AP_TITLE;
        var timeStr = [];
        for (let record of recds) {
            if (!record.step)
                record.step = 0;
            var dateStr = moment(record.startTime).utcOffset('+0000').format(DHDateFormat_1.DHDateFormat.DATE_FORMAT);
            var startTimeStr = moment(record.startTime).utcOffset('+0000').format(DHDateFormat_1.DHDateFormat.TIME_FORMAT);
            var endTimeStr = moment(record.endTime).utcOffset('+0000').format(DHDateFormat_1.DHDateFormat.TIME_FORMAT);
            timeStr.push({
                dateStr: dateStr,
                startTimeStr: startTimeStr,
                endTimeStr: endTimeStr
            });
        }
        let options = {
            auth: this.getAuth(req, DHAPI_1.DHAPI.RECORD_PATH, true),
            totalCount: tCount,
            pageIndex: pIndex,
            pageCount: pCount,
            count: this.displayCount,
            previous: pIndex > 1,
            next: pIndex < pCount,
            records: recds,
            times: timeStr
        };
        this.render(req, res, 'record/index', options);
    }
    renderPreviewRecord(req, res, next, user, record) {
        this.title = BaseRoute_1.BaseRoute.AP_TITLE;
        var dateStr = moment(record.startTime).utcOffset('+0000').format(DHDateFormat_1.DHDateFormat.DATE_FORMAT);
        var startTimeStr = moment(record.startTime).utcOffset('+0000').format(DHDateFormat_1.DHDateFormat.TIME_FORMAT);
        var endTimeStr = moment(record.endTime).utcOffset('+0000').format(DHDateFormat_1.DHDateFormat.TIME_FORMAT);
        let options = {
            auth: this.getAuth(req, DHAPI_1.DHAPI.RECORD_PATH, false),
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
            step: record.step,
            locations: record.locations
        };
        this.render(req, res, 'record/publicIndex', options);
    }
}
exports.RecordRoute = RecordRoute;
