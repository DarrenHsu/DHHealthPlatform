import * as mongoose from "mongoose";
import { Router } from "express";

import { DHAPI }        from "../../const/DHAPI";
import { DHLog }        from "../../util/DHLog";

import { BaseAPI }      from "./BaseAPI";

import { DBHelper }     from "../../mongo/helper/DBHelper";
import { UserHelper }   from "../../mongo/helper/UserHelper";

/**
 * @description 使用者相關 api 
 */
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
