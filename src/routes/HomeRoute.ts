import { NextFunction, Request, Response, Router } from 'express';
import { BaseRoute } from './BaseRoute';
import { DHAPI } from '../const/DHAPI';
import { LINEAPI } from '../const/LINEAPI';
import { DHLog } from '../util/DHLog';

export class HomeRoute extends BaseRoute {
    
    constructor() {
        super();
    }

    public static create(router: Router) {
        var app = new HomeRoute();

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