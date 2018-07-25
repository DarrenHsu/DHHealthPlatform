import * as mongoose from 'mongoose';

import { NextFunction, Request, Response, Router } from 'express';

import { BaseRoute }    from './BaseRoute';

import { RecordHelper } from '../mongo/helper/RecordHelper';

import { DBHelper }     from '../mongo/helper/DBHelper';
import { DHAPI }        from '../const/DHAPI';
import { DHLog }        from '../util/DHLog';

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
        router.get(DHAPI.ROOT_PATH, (req: Request, res: Response, next: NextFunction) => {
            if (!this.checkLogin(req, res, next)) {
                return;
            }

            this.renderHome(req, res, next);
        });
    }

    /**
     * @description 首頁畫面
     * @param router 
     */
    public getHome(router: Router) {
        DHLog.d('[' + HomeRoute.name + ':create] ' + DHAPI.HOME_PATH);
        router.get(DHAPI.HOME_PATH, (req: Request, res: Response, next: NextFunction) => {
            if (!this.checkLogin(req, res, next)) {
                return;
            }

            this.renderHome(req, res, next);
        });
    }

    public renderHome(req: Request, res: Response, next: NextFunction) {
        this.title = BaseRoute.AP_TITLE;
        let options: Object = {
            auth: this.getAuth(req, DHAPI.HOME_PATH, true),            
            account: req.session.account,
            name: req.session.name,
            picture: req.session.picture, 
        };
        this.render(req, res, 'home/index', options);
    }
}