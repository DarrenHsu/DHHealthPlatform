"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseRoute_1 = require("../BaseRoute");
const ResultCode_1 = require("../ResultCode");
const DBHelper_1 = require("../../mongo/helper/DBHelper");
const RecordHelper_1 = require("../../mongo/helper/RecordHelper");
const Path_1 = require("../../const/Path");
class RecordAPI extends BaseRoute_1.BaseRoute {
    constructor(connection) {
        super();
        this.uri = Path_1.DHAPI.API_RECORD_PATH;
        this.helper = new RecordHelper_1.RecordHelper(connection);
    }
    static create(router) {
        let api = new RecordAPI(DBHelper_1.DBHelper.connection);
        console.log("[RecordAPI::create] Creating RecordAPI route " + api.uri);
        api.get(router);
        api.post(router);
        api.put(router);
        api.delete(router);
    }
    get(router) {
        router.get(this.uri + "/:userId", (req, res, next) => {
            res.setHeader("Content-type", "application/json");
            if (!req.params.userId) {
                res.json(BaseRoute_1.BaseRoute.createResult(null, ResultCode_1.CONNECTION_CODE.CC_PARAMETER_ERROR));
                return;
            }
            this.helper.list(req.params.userId, (code, results) => {
                res.json(BaseRoute_1.BaseRoute.createResult(results, code));
            });
        });
    }
    put(router) {
        router.put(this.uri + "/:id", (req, res, next) => {
            res.setHeader("Content-type", "application/json");
            if (!req.params.id) {
                res.json(BaseRoute_1.BaseRoute.createResult(null, ResultCode_1.CONNECTION_CODE.CC_PARAMETER_ERROR));
                return;
            }
            if (!(req.body)) {
                res.json(BaseRoute_1.BaseRoute.createResult(null, ResultCode_1.CONNECTION_CODE.CC_REQUEST_BODY_ERROR));
                return;
            }
            this.helper.save(req.params.id, req.body, (code, result) => {
                res.json(BaseRoute_1.BaseRoute.createResult(result, code));
            });
        });
    }
    post(router) {
        router.post(this.uri, (req, res, next) => {
            res.setHeader("Content-type", "application/json");
            if (!req.body) {
                res.json(BaseRoute_1.BaseRoute.createResult(null, ResultCode_1.CONNECTION_CODE.CC_REQUEST_BODY_ERROR));
                return;
            }
            this.helper.add(req.body, (code, result) => {
                res.json(BaseRoute_1.BaseRoute.createResult(result, code));
            });
        });
    }
    delete(router) {
        router.delete(this.uri + "/:id", (req, res, next) => {
            res.setHeader("Content-type", "application/json");
            if (!req.params.id) {
                res.json(BaseRoute_1.BaseRoute.createResult(null, ResultCode_1.CONNECTION_CODE.CC_PARAMETER_ERROR));
                return;
            }
            this.helper.remove(req.params.id, (code) => {
                res.json(BaseRoute_1.BaseRoute.createResult(null, code));
            });
        });
    }
}
exports.RecordAPI = RecordAPI;
