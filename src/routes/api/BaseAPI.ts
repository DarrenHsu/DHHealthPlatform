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
            res.setHeader("Content-type", "application/json");

            if (!this.checkHeader(req)) {
                res.statusCode = 403;
                res.json(BaseRoute.createResult(null, CONNECTION_CODE.CC_AUTH_ERROR));
                return;
            }
            
            if (!req.params.id) {
                res.json(BaseRoute.createResult(null, CONNECTION_CODE.CC_PARAMETER_ERROR));
                return;
            }

            this.helper.list(req.params.id, (code, results) => {
                res.json(BaseRoute.createResult(results, code));
            });
        });
    }

    protected put(router: Router) {
        router.put(this.uri + "/:id", (req, res, next) => {
            res.setHeader("Content-type", "application/json");

            if (!this.checkHeader(req)) {
                res.statusCode = 403;
                res.json(BaseRoute.createResult(null, CONNECTION_CODE.CC_AUTH_ERROR));
                return;
            }

            if (!req.params.id) {
                res.json(BaseRoute.createResult(null, CONNECTION_CODE.CC_PARAMETER_ERROR));
                return;
            }

            if (!(req.body)) {
                res.json(BaseRoute.createResult(null, CONNECTION_CODE.CC_REQUEST_BODY_ERROR));
                return;
            }

            this.helper.save(req.params.id, req.body, (code, result) => {
                res.json(BaseRoute.createResult(result, code));
            });
        });
    }

    protected post(router: Router) {
        router.post(this.uri, (req, res, next) => {
            res.setHeader("Content-type", "application/json");

            if (!this.checkHeader(req)) {
                res.statusCode = 403;
                res.json(BaseRoute.createResult(null, CONNECTION_CODE.CC_AUTH_ERROR));
                return;
            }
            
            if (!req.body) {
                res.json(BaseRoute.createResult(null, CONNECTION_CODE.CC_REQUEST_BODY_ERROR));
                return;
            }

            this.helper.add(req.body, (code, result) => {
                res.json(BaseRoute.createResult(result, code));
            });
        });
    }

    protected delete(router: Router) {
        router.delete(this.uri + "/:id", (req, res, next) => {
            res.setHeader("Content-type", "application/json");

            if (!this.checkHeader(req)) {
                res.statusCode = 403;
                res.json(BaseRoute.createResult(null, CONNECTION_CODE.CC_AUTH_ERROR));
                return;
            }

            if (!req.params.id) {
                res.json(BaseRoute.createResult(null, CONNECTION_CODE.CC_PARAMETER_ERROR));
                return;
            }

            this.helper.remove(req.params.id, (code) => {
                res.json(BaseRoute.createResult(null, code));
            });
        });
    }
}