import mongoose = require("mongoose");
import { NextFunction, Request, Response, Router } from "express";
import { BaseAPI } from "./BaseAPI";
import { MONGODB_CODE, CONNECTION_CODE, ResultCodeMsg } from "../ResultCode";
import { DBHelper } from "../../mongo/helper/DBHelper";
import { UserHelper } from "../../mongo/helper/UserHelper";
import { IUser } from "../../mongo/interface/IUser";
import { DHAPI } from "../../const/DHAPI";
import { DHLog } from "../../util/DHLog";

export class UserAPI extends BaseAPI {
    
    protected helper: UserHelper;
    protected uri = DHAPI.API_USER_PATH;
    
    public static create(router: Router) {
        let api = new UserAPI(DBHelper.connection);
        DHLog.d("[" + this.name + ":create] " + api.uri);
        api.get(router);
        api.post(router);
        api.put(router);
        api.delete(router);
    }

    constructor(connection: mongoose.Connection) {
        super();
        this.helper = new UserHelper(connection);
    }
}
