"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ResultCode_1 = require("./ResultCode");
const BaseRoute_1 = require("./BaseRoute");
const DBHelper_1 = require("../mongo/helper/DBHelper");
const RecordHelper_1 = require("../mongo/helper/RecordHelper");
const Path_1 = require("../const/Path");
const DHLog_1 = require("../util/DHLog");
class RecordRouter extends BaseRoute_1.BaseRoute {
    constructor(connection) {
        super();
        this.uri = Path_1.DHAPI.RECORD_PATH;
        this.helper = new RecordHelper_1.RecordHelper(connection);
    }
    static create(router) {
        var app = new RecordRouter(DBHelper_1.DBHelper.connection);
        DHLog_1.DHLog.d("[" + this.name + ":create] " + app.uri);
        app.get(router);
    }
    get(router) {
        router.get(Path_1.DHAPI.RECORD_PATH + "/:id//:auth", (req, res, next) => {
            if (req.params.id == null || req.params.auth == null) {
                res.json(BaseRoute_1.BaseRoute.createResult(null, ResultCode_1.CONNECTION_CODE.CC_PARAMETER_ERROR));
                return;
            }
            if (!this.checkParam(req.params.auth, req.params.id)) {
                res.statusCode = 403;
                res.json(BaseRoute_1.BaseRoute.createResult(null, ResultCode_1.CONNECTION_CODE.CC_AUTH_ERROR));
                return;
            }
            this.helper.get(req.params.id, (code, result) => {
                this.index(req, res, next, result);
            });
        });
    }
    index(req, res, next, record) {
        this.title = "Home | DHHealthPlatform | record";
        let options = {
            "message": "Welcome to the Record",
            "data": record
        };
        this.render(req, res, "record", options);
    }
}
exports.RecordRouter = RecordRouter;
