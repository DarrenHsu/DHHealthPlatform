import mongoose = require("mongoose");
import { createHmac, createHash } from "crypto";
import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "../BaseRoute";
import { CONNECTION_CODE, MONGODB_CODE, ResultCodeMsg } from "../ResultCode";
import { DBHelper } from "../../mongo/helper/DBHelper";
import { BaseHelper } from "../../mongo/helper/BaseHelper";
import { IBase } from "../../mongo/interface/IBase";
import { DHAPI } from "../../const/Path";
import { DHLog } from "../../util/DHLog";

export class BaseAPI extends BaseRoute {

    protected static FEED_AUTH: string = "Darren Hsu I Love You";
    protected static FEED_AUTH_PASS: string = "I'm Darren";
    protected helper: BaseHelper;
    protected uri: string;

    public static create(router: Router) {}

    protected checkHeader(auth: string, text: string): Boolean {
        if (text == BaseAPI.FEED_AUTH_PASS) 
            return true;
        
        var s0 = createHash("SHA256").update(BaseAPI.FEED_AUTH + test).digest("base64");
        DHLog.d("s0  :" + s0);
        DHLog.d("auth:" + auth);
        return auth == s0;
    }
    
    protected get(router: Router) {
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

    protected put(router: Router) {
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

    protected post(router: Router) {
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

    protected delete(router: Router) {
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