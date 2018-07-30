import * as mongoose    from 'mongoose';
import * as moment      from 'moment';

import { NextFunction, Request, Response, Router } from 'express';

import { BaseRoute }    from './BaseRoute';

import { RecordHelper } from '../mongo/helper/RecordHelper';

import { DHDateFormat } from '../const/DHDateFormat';
import { DBHelper }     from '../mongo/helper/DBHelper';
import { DHAPI }        from '../const/DHAPI';
import { DHLog }        from '../util/DHLog';
import { IRecord } from '../mongo/interface/IRecord';

/**
 * @description 首頁路由控制
 */
export class HomeRoute extends BaseRoute {
    
    private recordHelper: RecordHelper;

    constructor(connection: mongoose.Connection) {
        super();

        this.recordHelper = new RecordHelper(connection);
    }

    public static create(router: Router) {
        var app = new HomeRoute(DBHelper.connection);

        app.getIndex(router);
        app.getHome(router);
    }

    /**
     * @description 首頁畫面
     * @param router 
     */
    public getIndex(router: Router) {
        DHLog.d('[' + HomeRoute.name + ':create] ' + DHAPI.ROOT_PATH);
        router.get(DHAPI.ROOT_PATH, (req, res, next) => {
            if (!this.checkLogin(req, res, next)) {
                return;
            }

            var today = moment().startOf('day')
            var decreaseMonth = moment(today).add(-1, 'M').format(DHDateFormat.DATE_FORMAT);
            
            let condition = {
                lineUserId: req.session.account, 
                startTime: {'$gte' : decreaseMonth}
            };

            let sort = {
                startTime: -1
            }

            this.recordHelper.findWith(condition, sort, (Code, records) => {
                this.renderHome(req, res, next, records);
            });
        });
    }

    /**
     * @description 首頁畫面
     * @param router 
     */
    public getHome(router: Router) {
        DHLog.d('[' + HomeRoute.name + ':create] ' + DHAPI.HOME_PATH);
        router.get(DHAPI.HOME_PATH, (req, res, next) => {
            if (!this.checkLogin(req, res, next)) {
                return;
            }

            this.renderHome(req, res, next, []);
        });
    }

    public renderHome(req: Request, res: Response, next: NextFunction, records: IRecord[]) {
        let imgLocations = [];
        for (let record of records) {
            for (let lindex of record.imglocations) {
                let location = record.locations[lindex];
                imgLocations.push({lat: location[0], lon: location[1]});
            }
        }
        DHLog.d("img locations: " + imgLocations.length);

        this.title = BaseRoute.AP_TITLE;
        let options: Object = {
            auth: this.getAuth(req, DHAPI.HOME_PATH, true),
            account: req.session.account,
            name: req.session.name,
            picture: req.session.picture, 
            imgLocation: imgLocations
        };
        this.render(req, res, 'home/index', options);
    }
}