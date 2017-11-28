import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "./BaseRoute";
import { DHAPI } from "../const/Path";

export class IndexRoute extends BaseRoute {
    
    public static create(router: Router) {
        console.log("[IndexRoute::create] Creating index route " + DHAPI.ROOT_PATH);
        router.get(DHAPI.ROOT_PATH, (req: Request, res: Response, next: NextFunction) => {
            new IndexRoute().index(req, res, next);
        });

        router.post(DHAPI.ROOT_PATH, (req: Request, res: Response, next: NextFunction) => {
            new IndexRoute().index(req, res, next);
        });
    }

    constructor() {
        super();
    }

    public index(req: Request, res: Response, next: NextFunction) {
        this.title = "Home | DHHealthPlatform | index";
        let options: Object = {
            "message": "Welcome to the Index"
        };
        this.render(req, res, "index", options);
    }
}