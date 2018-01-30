"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const compression = require("compression");
const logger = require("morgan");
const path = require("path");
const errorHandler = require("errorhandler");
const methodOverride = require("method-override");
const DBHelper_1 = require("../mongo/helper/DBHelper");
const IndexRoute_1 = require("../routes/IndexRoute");
const RecordRouter_1 = require("../routes/RecordRouter");
const RecordAPI_1 = require("../routes/api/RecordAPI");
const UserAPI_1 = require("../routes/api/UserAPI");
const RouteAPI_1 = require("../routes/api/RouteAPI");
const LineWebhookAPI_1 = require("../routes/api/LineWebhookAPI");
class Server {
    constructor() {
        this.pkgjson = require("../../package.json");
        DBHelper_1.DBHelper.openDB(this.pkgjson.mongodb[1].server);
        this.app = express();
        this.config();
        this.routes();
        this.api();
    }
    static bootstrap() {
        return new Server();
    }
    config() {
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
        this.app.use(function (err, req, res, next) {
            err.status = 404;
            next(err);
        });
        this.app.use(errorHandler());
    }
    routes() {
        let router = express.Router();
        IndexRoute_1.IndexRoute.create(router);
        RecordRouter_1.RecordRouter.create(router);
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
