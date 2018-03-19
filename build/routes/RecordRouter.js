"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const querystring = require("querystring");
const en_1 = require("ts-date/locale/en");
const ResultCode_1 = require("./ResultCode");
const BaseRoute_1 = require("./BaseRoute");
const DBHelper_1 = require("../mongo/helper/DBHelper");
const RecordHelper_1 = require("../mongo/helper/RecordHelper");
const UserHelper_1 = require("../mongo/helper/UserHelper");
const DHAPI_1 = require("../const/DHAPI");
const DHDateFormat_1 = require("../const/DHDateFormat");
const DHLog_1 = require("../util/DHLog");
class RecordRouter extends BaseRoute_1.BaseRoute {
    constructor(connection) {
        super();
        this.uri = DHAPI_1.DHAPI.RECORD_PATH;
        this.recordHelper = new RecordHelper_1.RecordHelper(connection);
        this.userHelper = new UserHelper_1.UserHelper(connection);
    }
    static create(router) {
        var app = new RecordRouter(DBHelper_1.DBHelper.connection);
        DHLog_1.DHLog.d("[" + this.name + ":create] " + app.uri);
        app.get(router);
    }
    /**
     * @description 取得紀錄並顯示單筆紀錄祥細內容
     * @param router
     */
    get(router) {
        router.get(DHAPI_1.DHAPI.RECORD_PATH + "/:id/:auth", (req, res, next) => {
            if (req.params.id == null || req.params.auth == null) {
                res.json(BaseRoute_1.BaseRoute.createResult(null, ResultCode_1.CONNECTION_CODE.CC_PARAMETER_ERROR));
                return;
            }
            let recordId = querystring.unescape(req.params.id);
            let auth = querystring.unescape(req.params.auth);
            if (!this.checkParam(auth, recordId)) {
                res.statusCode = 403;
                res.json(BaseRoute_1.BaseRoute.createResult(null, ResultCode_1.CONNECTION_CODE.CC_AUTH_ERROR));
                return;
            }
            this.recordHelper.get(recordId, (code, record) => {
                if (code != ResultCode_1.MONGODB_CODE.MC_SUCCESS) {
                    res.json(BaseRoute_1.BaseRoute.createResult(null, code));
                    return;
                }
                this.userHelper.list(record.lineUserId, (code, user) => {
                    this.index(req, res, next, user[0], record);
                });
            });
        });
    }
    index(req, res, next, user, record) {
        this.title = "DHHealthPlatform";
        var dateStr = en_1.format(record.startTime, DHDateFormat_1.DHDateFormat.DATE_FORMAT);
        var startTimeStr = en_1.format(record.startTime, DHDateFormat_1.DHDateFormat.TIME_FORMAT);
        var endTimeStr = en_1.format(record.endTime, DHDateFormat_1.DHDateFormat.TIME_FORMAT);
        let options = {
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
        this.render(req, res, "record", options);
    }
}
exports.RecordRouter = RecordRouter;
