import mongoose = require("mongoose");
import { NextFunction, Request, Response, Router } from "express";
import { BaseAPI } from "./BaseAPI";
import { CONNECTION_CODE, MONGODB_CODE, ResultCodeMsg } from "../ResultCode";
import { DBHelper } from "../../mongo/helper/DBHelper";
import { RecordHelper } from "../../mongo/helper/RecordHelper";
import { IRecord } from "../../mongo/interface/IRecord";
import { DHAPI } from "../../const/Path";

export class RecordAPI extends BaseAPI {

    protected helper: RecordHelper;
    protected uri = DHAPI.API_RECORD_PATH;
    
    public static create(router: Router) {
        let api = new RecordAPI(DBHelper.connection);
        console.log("[RecordAPI::create] Creating RecordAPI route " + api.uri);
        api.get(router);
        api.post(router);
        api.put(router);
        api.delete(router);
    }

    constructor(connection: mongoose.Connection) {
        super();
        this.helper = new RecordHelper(connection);
    }
}


