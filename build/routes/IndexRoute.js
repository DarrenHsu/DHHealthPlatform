"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseRoute_1 = require("./BaseRoute");
const Path_1 = require("../const/Path");
class IndexRoute extends BaseRoute_1.BaseRoute {
    static create(router) {
        console.log("[IndexRoute::create] Creating index route " + Path_1.DHAPI.ROOT_PATH);
        router.get(Path_1.DHAPI.ROOT_PATH, (req, res, next) => {
            new IndexRoute().index(req, res, next);
        });
        router.post(Path_1.DHAPI.ROOT_PATH, (req, res, next) => {
            new IndexRoute().index(req, res, next);
        });
    }
    constructor() {
        super();
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
