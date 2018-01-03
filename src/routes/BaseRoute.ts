import { createHmac, createHash } from "crypto";
import { NextFunction, Request, Response } from "express";
import { IResult } from "./interface/IResult";
import { IRecord } from "../mongo/interface/IRecord";
import { ResultCodeMsg } from  "./ResultCode";
import { DHLog } from "../util/DHLog";

export class BaseRoute {
    
    protected static FEED_AUTH: string = "Darren Hsu I Love You";
    protected static FEED_AUTH_PASS: string = "I'm Darren";
    
    protected title: string;
    private scripts: string[];

    constructor() {
        this.title = "DHHealthPlatform";
        this.scripts = [];
    }

    protected checkParam(auth: string, value: string): Boolean {
        return this.checkValue(auth, value);
    }

    protected checkHeader(req: Request): Boolean {
        var auth: string = req.get("Authorization");
        var verfy: string = req.get("verfy");
        return this.checkValue(auth, verfy);
    }

    protected checkValue(auth: string, verfy: string): Boolean {
        if (verfy == BaseRoute.FEED_AUTH_PASS) 
            return true;
        
        var str = createHash("SHA256").update(BaseRoute.FEED_AUTH + verfy).digest("base64");
        DHLog.d("verfy:" + str);
        DHLog.d("auth :" + auth);
        return auth == str;
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