import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "./BaseRoute";
import { DHAPI } from "../const/DHAPI";
import { DHLog } from "../util/DHLog";

export class LoginRoute extends BaseRoute {
    
    public static create(router: Router) {
        DHLog.d("[" + this.name + ":create] " + DHAPI.ROOT_PATH);
        router.get(DHAPI.LOGIN_PATH, (req: Request, res: Response, next: NextFunction) => {
            var lineAuth = req.session["LINE-AUTH"];
            DHLog.ld("lineAuth: " + lineAuth);
            new LoginRoute().index(req, res, next);
        });

        router.get(DHAPI.LOGIN_PROCESS_PATH, (req: Request, res: Response, next: NextFunction) => {
            req.session["LINE-AUTH"] = "ThisIsALineTestAuthKey";
            var lineAuth = req.session["LINE-AUTH"];
            DHLog.ld("set lineAuth: " + lineAuth);
        });
    }

    constructor() {
        super();
    }

    public index(req: Request, res: Response, next: NextFunction) {
        this.title = "Home | DHHealthPlatform | login";
        let options: Object = {
            "message": "Welcome to the login"
        };
        this.render(req, res, "login", options);
    }
}