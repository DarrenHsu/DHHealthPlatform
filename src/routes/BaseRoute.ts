import { NextFunction, Request, Response } from "express";
import { IResult } from "./interface/IResult";
import { IRecord } from "../mongo/interface/IRecord";
import { ResultCodeMsg } from  "./ResultCode";

export class BaseRoute {
    
    protected title: string;
    private scripts: string[];

    constructor() {
        this.title = "DHHealthPlatform";
        this.scripts = [];
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