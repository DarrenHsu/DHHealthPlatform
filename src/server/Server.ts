import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import * as session from "express-session";
import * as connectMongo from "connect-mongo";
import * as compression from "compression";
import * as logger from "morgan";
import * as path from "path";
import os = require("os");
import errorHandler = require("errorhandler");
import methodOverride = require("method-override");
import mongoose = require("mongoose");
import { DBHelper } from  "../mongo/helper/DBHelper";
import { IndexRoute } from "../routes/IndexRoute";
import { LoginRoute } from "../routes/LoginRoute";
import { RecordRouter } from "../routes/RecordRouter";
import { DHAPI } from "../const/DHAPI";
import { RecordAPI } from "../routes/api/RecordAPI";
import { UserAPI } from "../routes/api/UserAPI";
import { RouteAPI } from "../routes/api/RouteAPI";
import { LineWebhookAPI } from "../routes/api/LineWebhookAPI"
import { DHLog } from "../util/DHLog";

var MongoStore = connectMongo(session);

export class Server {
    private pkgjson = require("../../package.json");
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
    }

    public config() {
        var hostname = os.hostname();
        DHLog.d("domain " + hostname);

        this.app.use(express.static(path.join(__dirname, "../../public")));
        this.app.use("/scripts", express.static(path.join(__dirname, "../../node_modules/bootstrap/dist/js/")));
        this.app.use("/styles", express.static(path.join(__dirname, "../../node_modules/bootstrap/dist/css/")));
        this.app.use("/scripts", express.static(path.join(__dirname, "../../node_modules/jquery/dist/")));
        this.app.use("/scripts", express.static(path.join(__dirname, "../../node_modules/popper.js/dist/")));
        this.app.set("views", path.join(__dirname, "../../views"));
        this.app.set("view engine", "pug");
        this.app.use(compression());
        this.app.use(logger("dev"));
        this.app.use(bodyParser.json({limit: "10mb"}) );
        this.app.use(bodyParser.urlencoded({
            limit: "10mb",
            extended: true,
            parameterLimit: 50000
        }));
        this.app.use(cookieParser("SECRET_GOES_HERE"));
        this.app.use(methodOverride());
        this.app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
            err.status = 404;
            next(err);
        });
        this.app.use(errorHandler());
        this.app.use(session({
            secret: "01234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567",
            store: new MongoStore({url: "mongodb://heroku_bdqnk9d9:ust40bgdnkarqua01oopsr1c24@ds125016.mlab.com:25016/heroku_bdqnk9d9"}),
            resave: false,
            saveUninitialized: true,
            cookie: {maxAge: 60 * 1000}
        }));
    }

    private routes() {
        let router: express.Router = express.Router();

        IndexRoute.create(router);
        LoginRoute.create(router);
        RecordRouter.create(router);
        
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