import mongoose = require("mongoose");
import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "../BaseRoute";
import { CONNECTION_CODE, MONGODB_CODE, ResultCodeMsg } from "../ResultCode";
import { DBHelper } from "../../mongo/helper/DBHelper";
import { BaseHelper } from "../../mongo/helper/BaseHelper";
import { IBase } from "../../mongo/interface/IBase";
import { DHAPI } from "../../const/DHAPI";
import { DHLog } from "../../util/DHLog";

export class BaseAPI extends BaseRoute {

    protected helper: BaseHelper;
    protected uri: string;

    public static create(router: Router) {}

    protected get(router: Router) {
        router.get(this.uri + "/:id", (req, res, next) => {
            if (!this.checkHeader(req)) {
                this.sendAuthFaild(res);
                return;
            }
            
            if (!req.params.id) {
                this.sendParamsFaild(res);
                return;
            }

            this.helper.list(req.params.id, (code, results) => {
                this.sendSuccess(res, code, results);
            });
        });
    }

    protected put(router: Router) {
        router.put(this.uri + "/:id", (req, res, next) => {
            if (!this.checkHeader(req)) {
                this.sendAuthFaild(res);
                return;
            }

            if (!req.params.id) {
                this.sendParamsFaild(res);
                return;
            }

            if (!(req.body)) {
                this.sendBodyFaild(res);
                return;
            }

            this.helper.save(req.params.id, req.body, (code, result) => {
                this.sendSuccess(res, code, result);
            });
        });
    }

    protected post(router: Router) {
        router.post(this.uri, (req, res, next) => {
            if (!this.checkHeader(req)) {
                this.sendAuthFaild(res);
                return;
            }
            
            if (!req.body) {
                this.sendBodyFaild(res);
                return;
            }

            this.helper.add(req.body, (code, result) => {
                this.sendSuccess(res, code, result);
            });
        });
    }

    protected delete(router: Router) {
        router.delete(this.uri + "/:id", (req, res, next) => {
            if (!this.checkHeader(req)) {
                this.sendAuthFaild(res);
                return;
            }

            if (!req.params.id) {
                this.sendParamsFaild(res);
                return;
            }

            this.helper.remove(req.params.id, (code) => {
                this.sendSuccess(res, code);
            });
        });
    }

    protected sendSuccess(res: Response, code: number)
    protected sendSuccess(res: Response, code: number, result: IBase)
    protected sendSuccess(res: Response, code: number, result?: IBase) {
        res.setHeader("Content-type", "application/json");
        res.json(BaseRoute.createResult(result, code));
        res.end();
    }

    protected sendFaild(res: Response, code: number) {
        res.setHeader("Content-type", "application/json");
        res.json(BaseRoute.createResult(null, code));
        res.end();
    }

    protected sendAuthFaild(res: Response) {
        res.setHeader("Content-type", "application/json");
        res.statusCode = 403;
        res.json(BaseRoute.createResult(null, CONNECTION_CODE.CC_AUTH_ERROR));
        res.end();
    }

    protected sendParamsFaild(res: Response) {
        res.setHeader("Content-type", "application/json");
        res.json(BaseRoute.createResult(null, CONNECTION_CODE.CC_PARAMETER_ERROR));
        res.end();
    }

    protected sendBodyFaild(res: Response) {
        res.setHeader("Content-type", "application/json");
        res.json(BaseRoute.createResult(null, CONNECTION_CODE.CC_REQUEST_BODY_ERROR));
        res.end();
    }
}