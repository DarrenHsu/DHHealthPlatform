import * as mongoose        from 'mongoose';
import * as querystring     from 'querystring';
import * as moment          from 'moment';

import { DHDateFormat }     from '../const/DHDateFormat';
import { NextFunction, Request, Response, Router } from 'express';

import { CONNECTION_CODE, MONGODB_CODE } from './ResultCode';

import { BaseRoute }    from './BaseRoute';

import { DHAPI }        from '../const/DHAPI';
import { DHLog }        from '../util/DHLog';

import { DBHelper }     from '../mongo/helper/DBHelper';
import { RecordHelper } from '../mongo/helper/RecordHelper';
import { UserHelper }   from '../mongo/helper/UserHelper';
import { IRecord }      from '../mongo/interface/IRecord';
import { IUser }        from '../mongo/interface/IUser';
import { Code } from '../../node_modules/@types/bson';

declare type Location = {
    lat: string;
    lng: string;
};

/**
 * @description 紀錄路由控制
 */
export class RecordRoute extends BaseRoute {

    private userHelper: UserHelper;
    private recordHelper: RecordHelper;
    
    private displayCount: number = 8;
    
    constructor(connection: mongoose.Connection) {
        super();

        this.recordHelper = new RecordHelper(connection);
        this.userHelper = new UserHelper(connection);
    }
    
    public static create(router: Router) {
        var app = new RecordRoute(DBHelper.connection);
        
        app.getPreviewRecord(router);
        app.getRecord(router);
        app.delRecord(router);
    }

    public delRecord(router: Router) {
        DHLog.d('[' + RecordRoute.name + ':create] ' + DHAPI.RECORD_PATH);
        router.get(DHAPI.RECORD_PATH + '/:action/:id/:page', (req: Request, res: Response, next: NextFunction) => {
            if (!this.isCorrectHost(req)) {
                res.redirect("/whatup");
                return;
            }
            
            if (req.params.action && req.params.action == 'del') {
                this.recordHelper.removeWith({recordId: req.params.id}, (Code) => {
                    res.redirect('/records/' + req.params.page);
                });
            }
        });
    }

    /**
     * @description 顯示紀錄頁面
     * @param router 
     */
    public getRecord(router: Router) {
        DHLog.d('[' + RecordRoute.name + ':create] ' + DHAPI.RECORD_PATH);
        router.get(DHAPI.RECORD_PATH, (req: Request, res: Response, next: NextFunction) => {
            if (!this.checkLogin(req, res, next)) {
                return;
            }

            this.userHelper.find(req.session.account, (Code, users) => {
                this.findRecord(req.session.account, 1, (totalCount, pageCount, pageIndex, results) => {
                    this.renderRecord(req, res, next, totalCount, pageCount, pageIndex, users[0], results);
                });
            });
        });

        router.get(DHAPI.RECORD_PATH + '/:page', (req: Request, res: Response, next: NextFunction) => {
            if (!this.checkLogin(req, res, next)) {
                return;
            }

            var page = req.params.page;
            if (!page || page != parseInt(page, 10)) {
                return res.redirect(DHAPI.ERROR_PATH + '/' + CONNECTION_CODE.CC_PARAMETER_ERROR);
            }
            
            this.userHelper.find(req.session.account, (Code, users) => {
                this.findRecord(req.session.account, parseInt(page), (totalCount, pageCount, pageIndex, results) => {
                    this.renderRecord(req, res, next, totalCount, pageCount, pageIndex, users[0], results);
                });
            });
        });
    }

    private findRecord(lineUserId: string, page: number, callback: (totalCount: number, pageCount: number, pageIndex: number, records: IRecord[]) => void) {        
        this.recordHelper.find(lineUserId, (code, records) => {
            var start = (page - 1) * this.displayCount;
            var end = start + this.displayCount;
            var results = records.slice(start, end);
            var pageCount = Math.ceil(records.length / this.displayCount);
            callback(records.length, pageCount, page, results);
        });
    }

    /**
     * @description 取得紀錄並顯示單筆紀錄祥細內容
     * @param router 
     */
    public getPreviewRecord(router: Router) {
        DHLog.d('[' + RecordRoute.name + ':create] ' + DHAPI.RECORD_PREVIEW_PATH);
        router.get(DHAPI.RECORD_PREVIEW_PATH + '/:id/:auth', (req: Request, res: Response, next: NextFunction) => {
            if (req.params.id == null || req.params.auth == null) {
                return res.redirect(DHAPI.ERROR_PATH + '/' + CONNECTION_CODE.CC_PARAMETER_ERROR);
            }

            let recordId = querystring.unescape(req.params.id);
            let auth = querystring.unescape(req.params.auth);
            
            if (!this.checkParam(auth, recordId)) {
                return res.redirect(DHAPI.ERROR_PATH + '/' + CONNECTION_CODE.CC_AUTH_ERROR);
            }
            
            this.recordHelper.findOne(recordId, (code, record) => {
                if (code != MONGODB_CODE.MC_SUCCESS) {
                    return res.redirect(DHAPI.ERROR_PATH + '/' + code);
                }

                this.userHelper.find(record.lineUserId, (code, user) => {
                    this.renderPreviewRecord(req, res, next, user[0], record);
                });
            });
        });
    }

    public renderRecord(req: Request, res: Response, next: NextFunction, tCount: number, pCount: number,  pIndex: number, user: IUser, recds: IRecord[]) {
        this.title = BaseRoute.AP_TITLE;

        var timeStr = [];
        var recordResult = [];
        for (let record of recds) {
            if (!record.step) record.step = 0;

            var dateStr = moment(record.startTime).utcOffset('+0000').format(DHDateFormat.DATE_FORMAT);
            var startTimeStr = moment(record.startTime).utcOffset('+0000').format(DHDateFormat.TIME_FORMAT);
            var endTimeStr = moment(record.endTime).utcOffset('+0000').format(DHDateFormat.TIME_FORMAT);
            var minutes = moment(record.endTime).diff(moment(record.startTime), 'minutes');
            var calories = (record.avgSpeed * user.weight / 60.0) * minutes
            timeStr.push({
                dateStr: dateStr,
                startTimeStr: startTimeStr,
                endTimeStr: endTimeStr
            });
            recordResult.push({
                record: record,
                calories: calories
            })
        }

        let options: Object = {
            auth: this.getAuth(req, DHAPI.RECORD_PATH, true),
            totalCount: tCount,
            pageIndex: pIndex,
            pageCount: pCount,
            count: this.displayCount,
            previous: pIndex > 1,
            next: pIndex < pCount,
            recordResult: recordResult,
            times: timeStr
        };
        this.render(req, res, 'record/index', options);
    }

    public renderPreviewRecord(req: Request, res: Response, next: NextFunction, user: IUser, record: IRecord) {
        this.title = BaseRoute.AP_TITLE;
        var dateStr = moment(record.startTime).utcOffset('+0000').format(DHDateFormat.DATE_FORMAT);
        var startTimeStr = moment(record.startTime).utcOffset('+0000').format(DHDateFormat.TIME_FORMAT);
        var endTimeStr = moment(record.endTime).utcOffset('+0000').format(DHDateFormat.TIME_FORMAT);
        let options: Object = {
            auth: this.getAuth(req, DHAPI.RECORD_PATH, false),
            user: user.name,
            pictureUrl: user.pictureUrl,
            name: record.name,
            locality: record.locality,
            dateStr: dateStr,
            startTimeStr: startTimeStr,
            endTimeStr: endTimeStr,
            distance: record.distance.toFixed(1),
            maxSpeed: record.maxSpeed.toFixed(1),
            avgSpeed: record.avgSpeed.toFixed(1),
            step: ((record.step == null) ? 0 : record.step),
            locations: record.locations
        };
        this.render(req, res, 'record/publicIndex', options);
    }
}