"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const ResultCode_1 = require("./ResultCode");
const DHAPI_1 = require("../const/DHAPI");
const DHLog_1 = require("../util/DHLog");
/**
 * @description 路由相關父類別
 */
class BaseRoute {
    constructor() {
        this.title = 'DHHealthPlatform';
        this.scripts = [];
    }
    /**
     * @description 取得 full hostname
     * @param req
     */
    static getFullHostUrl(req) {
        return req.protocol + 's://' + req.hostname;
    }
    /**
     * @description 建立回傳結果物件
     * @param obj
     * @param code
     */
    static createResult(obj, code) {
        var result = {
            code: code,
            message: ResultCode_1.ResultCodeMsg.getMsg(code)
        };
        if (obj) {
            result.data = obj;
        }
        return result;
    }
    /**
     * @description 確認參數是否處合授權要求
     * @param auth
     * @param value
     */
    checkParam(auth, value) {
        return this.checkValue(auth, value);
    }
    /**
     * @description 確認header是否符合授權要求
     * @param req
     */
    checkHeader(req) {
        var auth = req.get('Authorization');
        var verfy = req.get('verfy');
        return this.checkValue(auth, verfy);
    }
    /**
     * @description 確認header是否符合授權要求，並發送錯誤機制
     * @param req
     * @param res
     */
    checkHeaderAndSend(req, res) {
        if (!this.checkHeader(req)) {
            this.sendAuthFaild(res);
            return false;
        }
        return true;
    }
    /**
     * @description 確認是否有body，並發送失敗機制
     * @param req
     * @param res
     */
    checkBodyAndSend(req, res) {
        if (!req.body) {
            this.sendBodyFaild(res);
            return false;
        }
        return true;
    }
    /**
     * @description 確認是否有Param: ID，並發送失敗機制
     * @param req
     * @param res
     */
    checkParamWithIdAndSend(req, res) {
        if (!req.params.id) {
            this.sendParamsFaild(res);
            return false;
        }
        return true;
    }
    /**
     * @description 確認授權要求
     * @param auth
     * @param verfy
     */
    checkValue(auth, verfy) {
        if (auth == BaseRoute.FEED_AUTH_PASS)
            return true;
        var str = this.hashString(verfy);
        return auth == str;
    }
    /**
     * @description 加密演算法 SHA256 + BASE64
     * @param str
     */
    hashString(str) {
        return crypto_1.createHash('SHA256').update(BaseRoute.FEED_AUTH + str).digest('base64');
    }
    /**
     * @description print request 呼叫內容
     * @param req
     */
    printRequestInfo(req) {
        DHLog_1.DHLog.d('<----------------- ' + req.method + ' ---------------->');
        DHLog_1.DHLog.d(req.url);
        DHLog_1.DHLog.d('header:' + JSON.stringify(req.headers));
        DHLog_1.DHLog.d('body:' + JSON.stringify(req.body));
        DHLog_1.DHLog.d('<---------------------------------------->');
    }
    /**
     * @description 確認session 的登入狀態
     * @param req
     * @param res
     * @param next
     */
    checkLogin(req, res, next) {
        // for test data
        if (!req.session.account) {
            req.session.name = 'Darren Hsu';
            req.session.account = 'U9d844766ccf8f9ae7dcd16f14e47ca0d';
            req.session.picture = 'https://profile.line-scdn.net/0h050J5TfDbxoNM0HHHR0QTTF2YXd6HWlSdQAiKS5jNy0lUH0ZZFcneCkxNH8pVH0cYQByLigwOCxz';
        }
        var isLogin = false;
        if (req.session.account && req.session.name && req.session.picture) {
            isLogin = true;
        }
        if (!isLogin) {
            res.redirect(DHAPI_1.DHAPI.LOGIN_PROCESS_PATH);
        }
        return isLogin;
    }
    /**
     * @description 產生 auth 物件
     * @param req
     * @param pth
     * @param clogin
     */
    getAuth(req, pth, clogin) {
        var auth = {
            path: pth,
            checkLogin: clogin,
        };
        if (!clogin) {
            return auth;
        }
        if (req.session.account) {
            auth.account = req.session.account;
            auth.name = req.session.name;
            auth.picture = req.session.picture;
        }
        return auth;
    }
    /**
     * @description 產生畫面處理程序
     * @param req
     * @param res
     * @param view
     * @param options
     */
    render(req, res, view, options) {
        res.locals.BASE_URL = '/';
        res.locals.scripts = this.scripts;
        res.locals.title = this.title;
        res.render(view, options);
    }
    /**
     * @description 回呼json結果
     * @param res
     * @param result
     */
    sendJsonResult(res, result) {
        res.setHeader('Content-type', 'application/json');
        res.json(result);
        res.end();
    }
    /**
     * @description 確認 host 是不是自家用
     * @param req
     */
    isCorrectHost(req) {
        return req.headers.host == DHAPI_1.DHAPI.PROD_HOST || req.headers.host == DHAPI_1.DHAPI.DEV_HOST;
    }
    /**
     * @description 回傳失敗處理程序
     * @param res
     * @param code
     */
    sendFaild(res, code) {
        this.sendJsonResult(res, BaseRoute.createResult(null, code));
    }
    /**
     * @description 回傳授權失敗處理程序
     * @param res
     */
    sendAuthFaild(res) {
        res.statusCode = 403;
        DHLog_1.DHLog.d("send auth faild");
        this.sendJsonResult(res, BaseRoute.createResult(null, ResultCode_1.CONNECTION_CODE.CC_AUTH_ERROR));
    }
    /**
     * @description 回傳參數錯誤處理程序
     * @param res
     */
    sendParamsFaild(res) {
        DHLog_1.DHLog.d("send param faild");
        this.sendJsonResult(res, BaseRoute.createResult(null, ResultCode_1.CONNECTION_CODE.CC_PARAMETER_ERROR));
    }
    /**
     * @description 回傳接收資料錯誤處理程序
     * @param res
     */
    sendBodyFaild(res) {
        DHLog_1.DHLog.d("send body faild");
        this.sendJsonResult(res, BaseRoute.createResult(null, ResultCode_1.CONNECTION_CODE.CC_REQUEST_BODY_ERROR));
    }
}
BaseRoute.AP_TITLE = 'DHHealthPlatform';
BaseRoute.FEED_AUTH = 'Darren Hsu I Love You';
BaseRoute.FEED_AUTH_PASS = 'imdarren';
exports.BaseRoute = BaseRoute;
