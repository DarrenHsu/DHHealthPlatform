import * as mongoose from 'mongoose';
import { Router } from 'express';

import { BaseAPI }      from './BaseAPI';

import { DHAPI }        from '../../const/DHAPI';
import { DHLog }        from '../../util/DHLog';

import { DBHelper }     from '../../mongo/helper/DBHelper';
import { RecordHelper } from '../../mongo/helper/RecordHelper';

/**
 * @description 紀錄相關 api 
 */
export class RecordAPI extends BaseAPI {

    protected helper: RecordHelper;
    protected uri = DHAPI.API_RECORD_PATH;
    
    public static create(router: Router) {
        let api = new RecordAPI(DBHelper.connection);
        DHLog.d('[' + this.name + ':create] ' + api.uri);

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


