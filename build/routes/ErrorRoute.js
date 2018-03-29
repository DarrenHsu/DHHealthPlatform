"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseRoute_1 = require("./BaseRoute");
const DHAPI_1 = require("../const/DHAPI");
const DHLog_1 = require("../util/DHLog");
const ResultCode_1 = require("./ResultCode");
class ErrorRoute extends BaseRoute_1.BaseRoute {
    constructor() {
        super();
    }
    static create(router) {
        var app = new ErrorRoute();
        app.getError(router);
    }
    /**
     * @description 蟣示錯誤頁面
     * @param router
     */
    getError(router) {
        DHLog_1.DHLog.d("[" + ErrorRoute.name + ":create] " + DHAPI_1.DHAPI.ERROR_PATH);
        router.get(DHAPI_1.DHAPI.ERROR_PATH + "/:errorCode", (req, res, next) => {
            var errorCode = req.params.errorCode;
            if (!errorCode) {
                var result = BaseRoute_1.BaseRoute.createResult(null, ResultCode_1.CONNECTION_CODE.CC_PARAMETER_ERROR);
            }
            else {
                var result = BaseRoute_1.BaseRoute.createResult(null, parseInt(errorCode));
            }
            this.renderError(req, res, next, result);
        });
    }
    renderError(req, res, next, result) {
        this.title = BaseRoute_1.BaseRoute.AP_TITLE;
        let options = {
            auth: {
                path: DHAPI_1.DHAPI.ERROR_PATH,
                checkLogin: false
            },
            result: result
        };
        this.render(req, res, "error/index", options);
    }
}
exports.ErrorRoute = ErrorRoute;
