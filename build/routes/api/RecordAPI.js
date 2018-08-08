"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseAPI_1 = require("./BaseAPI");
const DHAPI_1 = require("../../const/DHAPI");
const DHLog_1 = require("../../util/DHLog");
const DBHelper_1 = require("../../mongo/helper/DBHelper");
const RecordHelper_1 = require("../../mongo/helper/RecordHelper");
const ResultCode_1 = require("../ResultCode");
/**
 * @description 紀錄相關 api
 */
class RecordAPI extends BaseAPI_1.BaseAPI {
    constructor(connection) {
        super();
        this.uri = DHAPI_1.DHAPI.API_RECORD_PATH;
        this.helper = new RecordHelper_1.RecordHelper(connection);
    }
    static create(router) {
        let api = new RecordAPI(DBHelper_1.DBHelper.connection);
        DHLog_1.DHLog.d('[' + this.name + ':create] ' + api.uri);
        api.get(router);
        api.post(router);
        api.put(router);
        api.delete(router);
        api.uploadFile(router);
    }
    uploadFile(router) {
        DHLog_1.DHLog.d('[api:create] ' + DHAPI_1.DHAPI.API_RECORD_FILE_UPLOAD_PATH);
        router.post(DHAPI_1.DHAPI.API_RECORD_FILE_UPLOAD_PATH, (req, res, next) => {
            if (!this.checkHeaderAndSend(req, res))
                return;
            if (!req.files) {
                DHLog_1.DHLog.d("fileupload: file not found");
                this.sendFaild(res, ResultCode_1.CONNECTION_CODE.CC_FILEUPLOAD_ERROR);
            }
            else {
                DHLog_1.DHLog.d("fileupload: " + req.files.foo);
                this.sendSuccess(res, ResultCode_1.CONNECTION_CODE.CC_FILEUPLOAD_SUCCESS);
            }
        });
    }
}
exports.RecordAPI = RecordAPI;
