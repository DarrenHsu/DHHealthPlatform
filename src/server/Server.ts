import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as session from 'express-session';
import * as connectMongo from 'connect-mongo';
import * as compression from 'compression';
import * as logger from 'morgan';
import * as path from 'path';
import * as errorHandler from 'errorhandler';
import * as methodOverride from 'method-override';
import * as mongoose from 'mongoose';

import { DHLog } from '../util/DHLog';
import { DBHelper } from  '../mongo/helper/DBHelper';

import { HomeRoute } from '../routes/HomeRoute';
import { CalendarRoute } from '../routes/CalendarRoute';
import { LoginRoute } from '../routes/LoginRoute';
import { RecordRoute } from '../routes/RecordRoute';
import { LiveRoute } from '../routes/LiveRoute';
import { ErrorRoute } from '../routes/ErrorRoute';

import { DHAPI } from '../const/DHAPI';
import { RecordAPI } from '../routes/api/RecordAPI';
import { UserAPI } from '../routes/api/UserAPI';
import { RouteAPI } from '../routes/api/RouteAPI';
import { LineWebhookAPI } from '../routes/api/LineWebhookAPI'
import { CONNECTION_CODE, ResultCodeMsg } from '../routes/ResultCode';
import { BaseRoute } from '../routes/BaseRoute';

var MongoStore = connectMongo(session);

export class Server {
    private pkgjson = require('../../package.json');
    public app: express.Application;
    
    public static bootstrap(): Server {
        return new Server();
    }

    constructor() {
        DBHelper.openDB(this.pkgjson.mongodb[1].server);
        this.app = express();
        this.config();
        this.routes();
        this.api();

        this.app.use((req, res) => {
            res.locals.title = BaseRoute.AP_TITLE;
            var options = {
                auth: {
                    path: DHAPI.ERROR_PATH,
                    checkLogin: false
                }, 
                result: {
                    code: CONNECTION_CODE.CC_PAGE_NOT_FOUND_ERROR,
                    message: ResultCodeMsg.getMsg(CONNECTION_CODE.CC_PAGE_NOT_FOUND_ERROR)
                }
            }
            res.render('error/index', options);
        })
    }

    public config() {
        this.app.use(express.static(path.join(__dirname, '../../public')));

        this.app.use('/scripts', express.static(path.join(__dirname, '../../node_modules/bootstrap/dist/js/')));
        this.app.use('/scripts', express.static(path.join(__dirname, '../../node_modules/jquery/dist/')));
        this.app.use('/scripts', express.static(path.join(__dirname, '../../node_modules/fullcalendar/dist/')));
        this.app.use('/scripts', express.static(path.join(__dirname, '../../node_modules/moment/min/')));
        this.app.use('/scripts', express.static(path.join(__dirname, '../../node_modules/popper.js/dist/')));

        this.app.use('/styles', express.static(path.join(__dirname, '../../node_modules/bootstrap/dist/css/')));
        this.app.use('/styles', express.static(path.join(__dirname, '../../node_modules/fullcalendar/dist/')));
        
        this.app.set('views', path.join(__dirname, '../../views'));
        this.app.set('view engine', 'pug');

        this.app.use(compression());
        this.app.use(logger('dev'));
        this.app.use(bodyParser.json({limit: '10mb'}) );
        this.app.use(bodyParser.urlencoded({
            limit: '10mb',
            extended: true,
            parameterLimit: 50000
        }));
        this.app.use(cookieParser('SECRET_GOES_HERE'));
        this.app.use(methodOverride());
        this.app.use(session({
            secret: '01234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567',
            store: new MongoStore({url: 'mongodb://heroku_bdqnk9d9:ust40bgdnkarqua01oopsr1c24@ds125016.mlab.com:25016/heroku_bdqnk9d9'}),
            resave: false,
            saveUninitialized: true,
            cookie: {maxAge: 60 * 1000}
        }));
    }

    private routes() {
        let router: express.Router = express.Router();

        HomeRoute.create(router);
        CalendarRoute.create(router);
        LoginRoute.create(router);
        RecordRoute.create(router);
        LiveRoute.create(router);
        ErrorRoute.create(router);
        
        this.app.use(router);
    }

    public api() {
        let router: express.Router = express.Router();

        RecordAPI.create(router);
        UserAPI.create(router)
        RouteAPI.create(router);
        LineWebhookAPI.create(router);

        this.app.use(router);
    }
}