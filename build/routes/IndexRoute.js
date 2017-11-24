"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseRoute_1 = require("./BaseRoute");
const DBHelper_1 = require("../mongo/helper/DBHelper");
const RecordHelper_1 = require("../mongo/helper/RecordHelper");
const Path_1 = require("../const/Path");
class IndexRoute extends BaseRoute_1.BaseRoute {
    static create(router) {
        console.log("[IndexRoute::create] Creating index route " + Path_1.DHAPI.ROOT_PATH);
        router.get(Path_1.DHAPI.ROOT_PATH, (req, res, next) => {
            new IndexRoute().index(req, res, next);
        });
    }
    constructor() {
        super();
        this.helper = new RecordHelper_1.RecordHelper(DBHelper_1.DBHelper.connection);
    }
    index(req, res, next) {
        this.title = "Home | DHHealthPlatform | index";
        let options = {
            "message": "Welcome to the Index"
        };
        this.render(req, res, "index", options);
    }
}
exports.IndexRoute = IndexRoute;
