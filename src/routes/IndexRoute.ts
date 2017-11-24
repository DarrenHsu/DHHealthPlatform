import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "./BaseRoute";
import { DBHelper } from "../mongo/helper/DBHelper";
import { RecordHelper } from "../mongo/helper/RecordHelper";
import { DHAPI } from "../const/Path";

export class IndexRoute extends BaseRoute {
    private helper: RecordHelper;

    public static create(router: Router) {
        console.log("[IndexRoute::create] Creating index route " + DHAPI.ROOT_PATH);
        router.get(DHAPI.ROOT_PATH, (req: Request, res: Response, next: NextFunction) => {
          new IndexRoute().index(req, res, next);          
        });
    }

    constructor() {
        super();
        this.helper = new RecordHelper(DBHelper.connection);
    }

    public index(req: Request, res: Response, next: NextFunction) {
        this.title = "Home | DHHealthPlatform | index";
        let options: Object = {
          "message": "Welcome to the Index"
        };
        this.render(req, res, "index", options);
    }
}