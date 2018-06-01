import { createHmac, createHash } from 'crypto';
import { NextFunction, Request, Response } from 'express';

import { ResultCodeMsg }    from './ResultCode';
import { IAuth }            from './interface/IAuth';
import { IResult }          from './interface/IResult';

import { IRecord }          from '../mongo/interface/IRecord';

import { DHAPI }            from '../const/DHAPI';
import { DHLog }            from '../util/DHLog';

/**
 * @description 路由相關父類別
 */
export class BaseRoute {

    public static AP_TITLE: string = 'DHHealthPlatform';
    
    protected static FEED_AUTH: string = 'Darren Hsu I Love You';
    protected static FEED_AUTH_PASS: string = 'imdarren';
    
    protected title: string;
    private scripts: string[];

    constructor() {
        this.title = 'DHHealthPlatform';
        this.scripts = [];
    }

    /**
     * @description 取得 full hostname
     * @param req 
     */
    protected static getFullHostUrl(req: Request): String {
        return req.protocol + 's://' + req.hostname; 
    }

    /**
     * @description 建立回傳結果物件
     * @param obj 
     * @param code 
     */
    public static createResult(obj: any, code: number): IResult {
        var result: IResult = {
            code: code,
            message: ResultCodeMsg.getMsg(code)
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
    protected checkParam(auth: string, value: string): Boolean {
        return this.checkValue(auth, value);
    }

    /**
     * @description 確認header是否符合授權要求
     * @param req 
     */
    protected checkHeader(req: Request): Boolean {
        var auth: string = req.get('Authorization');
        var verfy: string = req.get('verfy');
        return this.checkValue(auth, verfy);
    }

    /**
     * @description 確認授權要求
     * @param auth 
     * @param verfy 
     */
    protected checkValue(auth: string, verfy: string): Boolean {
        if (auth == BaseRoute.FEED_AUTH_PASS) 
            return true;
        
        var str = this.hashString(verfy);
        DHLog.d('verfy:' + str);
        DHLog.d('auth :' + auth);
        return auth == str;
    }

    /**
     * @description 加密演算法 SHA256 + BASE64
     * @param str 
     */
    protected hashString(str: string): string {
        return createHash('SHA256').update(BaseRoute.FEED_AUTH + str).digest('base64');
    }

    /**
     * @description print request 呼叫內容
     * @param req 
     */
    protected printRequestInfo(req: Request) {
        DHLog.d('<----------------- ' + req.method + ' ---------------->');
        DHLog.d(req.url);
        DHLog.d('header:' + JSON.stringify(req.headers));
        DHLog.d('body:' + JSON.stringify(req.body));
        DHLog.d('<---------------------------------------->');
    }

    /**
     * @description 確認session 的登入狀態
     * @param req 
     * @param res 
     * @param next 
     */
    public checkLogin(req: Request, res: Response, next: NextFunction): boolean {
        // for test data
        // if (!req.session.account) {
        //     req.session.name = 'Darren Hsu';
        //     req.session.account = 'U9d844766ccf8f9ae7dcd16f14e47ca0d';
        //     req.session.picture = 'https://profile.line-scdn.net/0h050J5TfDbxoNM0HHHR0QTTF2YXd6HWlSdQAiKS5jNy0lUH0ZZFcneCkxNH8pVH0cYQByLigwOCxz';
        // }

        var isLogin = false;
        if (req.session.account && req.session.name && req.session.picture) {
            isLogin = true;
        }
        
        if (!isLogin) {
            res.redirect(DHAPI.LOGIN_PROCESS_PATH);
        }

        return isLogin;
    }

    /**
     * @description 產生 auth 物件
     * @param req 
     * @param pth 
     * @param clogin 
     */
    public getAuth(req: Request, pth: string, clogin: boolean): IAuth {
        var auth: IAuth = {
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
    public render(req: Request, res: Response, view: string, options?: Object) {
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
    protected sendJsonResult(res: Response ,result: any) {
        res.setHeader('Content-type', 'application/json');
        res.json(result);
        res.end();
    }
}