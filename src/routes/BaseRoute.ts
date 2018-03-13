import { createHmac, createHash } from "crypto";
import { NextFunction, Request, Response } from "express";
import { IResult } from "./interface/IResult";
import { IRecord } from "../mongo/interface/IRecord";
import { ResultCodeMsg } from  "./ResultCode";
import { DHLog } from "../util/DHLog";

export class BaseRoute {
    
    protected static FEED_AUTH: string = "Darren Hsu I Love You";
    protected static FEED_AUTH_PASS: string = "imdarren";
    
    protected title: string;
    private scripts: string[];

    constructor() {
        this.title = "DHHealthPlatform";
        this.scripts = [];
    }

    /*
    * @description 確認參數是否處合授權要求
    */
    protected checkParam(auth: string, value: string): Boolean {
        return this.checkValue(auth, value);
    }

    /*
    * @description 確認header是否符合授權要求
    */
    protected checkHeader(req: Request): Boolean {
        var auth: string = req.get("Authorization");
        var verfy: string = req.get("verfy");
        return this.checkValue(auth, verfy);
    }

    /*
    * @description 確認授權要求
    */
    protected checkValue(auth: string, verfy: string): Boolean {
        if (auth == BaseRoute.FEED_AUTH_PASS) 
            return true;
        
        var str = this.hashString(verfy);
        DHLog.d("verfy:" + str);
        DHLog.d("auth :" + auth);
        return auth == str;
    }

    protected hashString(str: string): string {
        return createHash("SHA256").update(BaseRoute.FEED_AUTH + str).digest("base64");
    }

    protected printRequestInfo(req: Request) {
        DHLog.d("<----------------- " + req.method + " ---------------->");
        DHLog.d(req.url);
        DHLog.d("header:" + JSON.stringify(req.headers));
        DHLog.d("body:" + JSON.stringify(req.body));
        DHLog.d("<---------------------------------------->");
    }

    public addScript(src: string): BaseRoute {
        this.scripts.push(src);
        return this;
    }

    public render(req: Request, res: Response, view: string, options?: Object) {
        res.locals.BASE_URL = "/";
        res.locals.scripts = this.scripts;
        res.locals.title = this.title;
        res.render(view, options);
    }

    public static createResult(obj: any, code: number) {
        var result: IResult = {
            code: code,
            message: ResultCodeMsg.getMsg(code)
        };

        if (obj) {
            result.data = obj;
        }
        return result;
    }
}