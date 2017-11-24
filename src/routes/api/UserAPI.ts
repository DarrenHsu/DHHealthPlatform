import mongoose = require("mongoose");
import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "../BaseRoute";
import { MONGODB_CODE, CONNECTION_CODE, ResultCodeMsg } from "../ResultCode";
import { DBHelper } from "../../mongo/helper/DBHelper";
import { UserHelper } from "../../mongo/helper/UserHelper";
import { IUser } from "../../mongo/interface/IUser";
import { DHAPI } from "../../const/Path";

export class UserAPI extends BaseRoute {
    private helper: UserHelper;
    private uri = DHAPI.API_USER_PATH;
    
    public static create(router: Router) {
        let api = new UserAPI(DBHelper.connection);
        console.log("[RecordAPI::create] Creating RecordAPI route " + api.uri);
        api.get(router);
        api.post(router);
        api.put(router);
        api.delete(router);
    }

    constructor(connection: mongoose.Connection) {
        super();
        this.helper = new UserHelper(connection);
    }
    
    public get(router: Router) {
        router.get(this.uri + "/:id", (req, res, next) => {
            res.setHeader("Content-type", "application/json");
            
            if (!req.params.id) {
                res.json(BaseRoute.createResult(null, CONNECTION_CODE.CC_PARAMETER_ERROR));
                return;
            }

            this.helper.list(req.params.id, (code, results) => {
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

            if (!req.body) {
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
