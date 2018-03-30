"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ResultCode_1 = require("./ResultCode");
const BaseRoute_1 = require("./BaseRoute");
const DBHelper_1 = require("../mongo/helper/DBHelper");
const RecordHelper_1 = require("../mongo/helper/RecordHelper");
const UserHelper_1 = require("../mongo/helper/UserHelper");
const DHAPI_1 = require("../const/DHAPI");
const DHLog_1 = require("../util/DHLog");
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
