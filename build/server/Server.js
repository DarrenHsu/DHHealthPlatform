"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const session = require("express-session");
const connectMongo = require("connect-mongo");
const compression = require("compression");
const logger = require("morgan");
const path = require("path");
const methodOverride = require("method-override");
const DBHelper_1 = require("../mongo/helper/DBHelper");
const HomeRoute_1 = require("../routes/HomeRoute");
const CalendarRoute_1 = require("../routes/CalendarRoute");
const LoginRoute_1 = require("../routes/LoginRoute");
const RecordRoute_1 = require("../routes/RecordRoute");
const LiveRoute_1 = require("../routes/LiveRoute");
const ErrorRoute_1 = require("../routes/ErrorRoute");
const DHAPI_1 = require("../const/DHAPI");
const RecordAPI_1 = require("../routes/api/RecordAPI");
const UserAPI_1 = require("../routes/api/UserAPI");
const RouteAPI_1 = require("../routes/api/RouteAPI");
const LineWebhookAPI_1 = require("../routes/api/LineWebhookAPI");
const ResultCode_1 = require("../routes/ResultCode");
const BaseRoute_1 = require("../routes/BaseRoute");
var MongoStore = connectMongo(session);
class Server {
    constructor() {
        this.pkgjson = require('../../package.json');
        DBHelper_1.DBHelper.openDB(this.pkgjson.mongodb[1].server);
        this.app = express();
        this.config();
        this.routes();
        this.api();
        this.app.use((req, res) => {
            res.locals.title = BaseRoute_1.BaseRoute.AP_TITLE;
            var options = {
                auth: {
                    path: DHAPI_1.DHAPI.ERROR_PATH,
                    checkLogin: false
                },
                result: {
                    code: ResultCode_1.CONNECTION_CODE.CC_PAGE_NOT_FOUND_ERROR,
                    message: ResultCode_1.ResultCodeMsg.getMsg(ResultCode_1.CONNECTION_CODE.CC_PAGE_NOT_FOUND_ERROR)
                }
            };
            res.render('error/index', options);
        });
    }
    static bootstrap() {
        return new Server();
    }
    config() {
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
        this.app.use(bodyParser.json({ limit: '10mb' }));
        this.app.use(bodyParser.urlencoded({
            limit: '10mb',
            extended: true,
            parameterLimit: 50000
        }));
        this.app.use(cookieParser('SECRET_GOES_HERE'));
        this.app.use(methodOverride());
        this.app.use(session({
            secret: '01234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567',
            store: new MongoStore({ url: 'mongodb://heroku_bdqnk9d9:ust40bgdnkarqua01oopsr1c24@ds125016.mlab.com:25016/heroku_bdqnk9d9' }),
            resave: false,
            saveUninitialized: true,
            cookie: { maxAge: 60 * 1000 }
        }));
    }
    routes() {
        let router = express.Router();
        HomeRoute_1.HomeRoute.create(router);
        CalendarRoute_1.CalendarRoute.create(router);
        LoginRoute_1.LoginRoute.create(router);
        RecordRoute_1.RecordRoute.create(router);
        LiveRoute_1.LiveRoute.create(router);
        ErrorRoute_1.ErrorRoute.create(router);
        this.app.use(router);
    }
    api() {
        let router = express.Router();
        RecordAPI_1.RecordAPI.create(router);
        UserAPI_1.UserAPI.create(router);
        RouteAPI_1.RouteAPI.create(router);
        LineWebhookAPI_1.LineWebhookAPI.create(router);
        this.app.use(router);
    }
}
exports.Server = Server;
