import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "./BaseRoute";
import { DHAPI } from "../const/Path";

export class RecordRouter extends BaseRoute {

    public static create(router: Router) {
        console.log("[RecordRouter::create] Creating record route " + DHAPI.RECORD_PATH);
        router.get(DHAPI.RECORD_PATH, (req: Request, res: Response, next: NextFunction) => {
          new RecordRouter().index(req, res, next);
        });
    }

    constructor() {
        super();
    }

    public index(req: Request, res: Response, next: NextFunction) {
        this.title = "Home | DHHealthPlatform | record";
        let options: Object = {
          "message": "Welcome to the Record"
        };
        this.render(req, res, "record", options);
    }
}