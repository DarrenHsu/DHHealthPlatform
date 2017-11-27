import mongoose = require("mongoose");
import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "../BaseRoute";
import { CONNECTION_CODE, MONGODB_CODE, ResultCodeMsg } from "../ResultCode";
import { DBHelper } from "../../mongo/helper/DBHelper";
import { BaseHelper } from "../../mongo/helper/BaseHelper";
import { IBase } from "../../mongo/interface/IBase";
import { DHAPI } from "../../const/Path";

export class BaseAPI extends BaseRoute {

    protected helper: BaseHelper;
    protected uri: string;

    public static create(router: Router) {
        
    }

    public get(router: Router) {
        router.get(this.uri + "/:userId", (req, res, next) => {
            res.setHeader("Content-type", "application/json");
            
            if (!req.params.userId) {
                res.json(BaseRoute.createResult(null, CONNECTION_CODE.CC_PARAMETER_ERROR));
                return;
            }

            this.helper.list(req.params.userId, (code, results) => {
                res.json(BaseRoute.createResult(results, code));
            });
        });
    }

    public put(router: Router) {
        router.put(this.uri + "/:id", (req, res, next) => {
            res.setHeader("Content-type", "application/json");
            
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

    public post(router: Router) {
        router.post(this.uri, (req, res, next) => {
            res.setHeader("Content-type", "application/json");
            
            if (!req.body) {
                res.json(BaseRoute.createResult(null, CONNECTION_CODE.CC_REQUEST_BODY_ERROR));
                return;
            }

            this.helper.add(req.body, (code, result) => {
                res.json(BaseRoute.createResult(result, code));
            });
        });
    }

    public delete(router: Router) {
        router.delete(this.uri + "/:id", (req, res, next) => {
            res.setHeader("Content-type", "application/json");
            
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