import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import * as compression from "compression";
import * as logger from "morgan";
import * as path from "path";
import errorHandler = require("errorhandler");
import methodOverride = require("method-override");
import mongoose = require("mongoose");
import { DBHelper } from  "../mongo/helper/DBHelper";
import { IndexRoute } from "../routes/IndexRoute";
import { RecordRouter } from "../routes/RecordRouter";
import { DHAPI } from "../const/DHAPI";
import { RecordAPI } from "../routes/api/RecordAPI";
import { UserAPI } from "../routes/api/UserAPI";
import { RouteAPI } from "../routes/api/RouteAPI";
import { LineWebhookAPI } from "../routes/api/LineWebhookAPI"
import { DHLog } from "../util/DHLog";

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
        this.app.use(express.static(path.join(__dirname, "../../public")));
        this.app.set("views", path.join(__dirname, "../../views"));
        this.app.set("view engine", "pug");
        this.app.use("/scripts", express.static(path.join(__dirname, "../../node_modules/bootstrap/dist/js/")));
        this.app.use("/styles", express.static(path.join(__dirname, "../../node_modules/bootstrap/dist/css/")));
        this.app.use("/scripts", express.static(path.join(__dirname, "../../node_modules/jquery/dist/")));
        this.app.use("/scripts", express.static(path.join(__dirname, "../../node_modules/popper.js/dist/")));
        this.app.use(compression());
        this.app.use(logger("dev"));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({
            extended: true
        }));
        this.app.use(cookieParser("SECRET_GOES_HERE"));
        this.app.use(methodOverride());
        this.app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
            err.status = 404;
            next(err);
        });
        this.app.use(errorHandler());
    }

    private routes() {
        let router: express.Router = express.Router();

        IndexRoute.create(router);
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