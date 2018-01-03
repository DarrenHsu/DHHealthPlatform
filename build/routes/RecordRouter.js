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
        DHLog_1.DHLog.d("[" + this.name + ":create] " + app.uri);
        var app = new RecordRouter(DBHelper_1.DBHelper.connection);
        app.get(router);
    }
    get(router) {
        router.get(Path_1.DHAPI.RECORD_PATH + "/:id/:auth", (req, res, next) => {
            var recordid = req.params.id;
            var auth = req.params.auth;
            if (!this.checkParam(auth, recordid)) {
                res.statusCode = 403;
                res.json(BaseRoute_1.BaseRoute.createResult(null, ResultCode_1.CONNECTION_CODE.CC_AUTH_ERROR));
                return;
            }
            this.index(req, res, next);
        });
    }
    index(req, res, next) {
        this.title = "Home | DHHealthPlatform | record";
        let options = {
            "message": "Welcome to the Record"
        };
        this.render(req, res, "record", options);
    }
}
exports.RecordRouter = RecordRouter;
