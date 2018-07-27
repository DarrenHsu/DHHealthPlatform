import * as mongoose from 'mongoose';
import * as fileupload from 'express-fileupload';
import { Router } from 'express';

import { BaseAPI }      from './BaseAPI';

import { DHAPI }        from '../../const/DHAPI';
import { DHLog }        from '../../util/DHLog';

import { DBHelper }     from '../../mongo/helper/DBHelper';
import { RecordHelper } from '../../mongo/helper/RecordHelper';
import { CONNECTION_CODE } from '../ResultCode';
import { type } from 'os';

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

        api.uploadFile(router);
    }

    constructor(connection: mongoose.Connection) {
        super();
        this.helper = new RecordHelper(connection);
    }

    public uploadFile(router: Router) {
        DHLog.d('[api:create] ' + DHAPI.API_RECORD_FILE_UPLOAD_PATH);
        router.post(DHAPI.API_RECORD_FILE_UPLOAD_PATH, (req, res, next) => {
            if (!this.checkHeader(req)) {
                this.sendAuthFaild(res);
                return;
            }
            
            if (!req.files) {
                DHLog.d("fileupload: file not found");
                this.sendFaild(res, CONNECTION_CODE.CC_FILEUPLOAD_ERROR);
            }else {
                DHLog.d("fileupload: " + req.files.foo);
                this.sendSuccess(res, CONNECTION_CODE.CC_FILEUPLOAD_SUCCESS);
            }
        });
    }
}


