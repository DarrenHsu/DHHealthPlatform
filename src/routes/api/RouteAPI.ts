import * as mongoose from 'mongoose';
import { NextFunction, Request, Response, Router } from 'express';

import { CONNECTION_CODE, MONGODB_CODE, ResultCodeMsg } from '../ResultCode';

import { DHAPI }        from '../../const/DHAPI';
import { DHLog }        from '../../util/DHLog';

import { BaseAPI }      from './BaseAPI';

import { DBHelper }     from '../../mongo/helper/DBHelper';
import { RouteHelper }  from '../../mongo/helper/RouteHelper';
import { IRoute }       from '../../mongo/interface/IRoute';

/**
 * @description 行程路線相關 api
 */
export class RouteAPI extends BaseAPI {

    protected helper: RouteHelper;
    protected uri = DHAPI.API_ROUTE_PATH;

    public static create(router: Router) {
        let api = new RouteAPI(DBHelper.connection);
        DHLog.d('[' + this.name + ':create] ' + api.uri);
        
        api.get(router);
        api.post(router);
        api.put(router);
        api.delete(router);
    }

    constructor(connection: mongoose.Connection) {
        super();
        this.helper = new RouteHelper(connection);
    }
}