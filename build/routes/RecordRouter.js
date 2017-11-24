"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseRoute_1 = require("./BaseRoute");
const Path_1 = require("../const/Path");
class RecordRouter extends BaseRoute_1.BaseRoute {
    static create(router) {
        console.log("[RecordRouter::create] Creating record route " + Path_1.DHAPI.RECORD_PATH);
        router.get(Path_1.DHAPI.RECORD_PATH, (req, res, next) => {
            new RecordRouter().index(req, res, next);
        });
    }
    constructor() {
        super();
    }
    index(req, res, next) {
        this.title = "Home | DHHealthPlatform | record";
        let options = {
            "message": "Welcome to the Record"
        };
        this.render(req, res, "record", options);
    }
}
exports.RecordRouter = RecordRouter;
