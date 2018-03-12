import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "./BaseRoute";
import { DHAPI } from "../const/DHAPI";
import { DHLog } from "../util/DHLog";

export class LoginRoute extends BaseRoute {
    
    public static create(router: Router) {
        DHLog.d("[" + this.name + ":create] " + DHAPI.LOGIN_INPUT_PATH);
        router.get(DHAPI.LOGIN_INPUT_PATH, (req: Request, res: Response, next: NextFunction) => {
            new LoginRoute().loginPage(req, res, next);
        });

        DHLog.d("[" + this.name + ":create] " + DHAPI.LOGIN_PROCESS_PATH);
        router.post(DHAPI.LOGIN_PROCESS_PATH, (req: Request, res: Response, next: NextFunction) => {
            var act = req.body.user.account;
            var pwd = req.body.user.password;

            DHLog.ld("act:" + act + " pwd:" + pwd);

            if (act == null || pwd == null) {
                new LoginRoute().loginPage(req, res, next);
            }else if (act == req.session.account) {
                req.session.time++;
                return res.redirect(DHAPI.ROOT_PATH);
            }else {
                req.session.account = act;
                req.session.time = 1;
                return res.redirect(DHAPI.ROOT_PATH);
            }
        });

        DHLog.d("[" + this.name + ":create] " + DHAPI.LOGIN_KILL_PATH);
        router.get(DHAPI.LOGIN_KILL_PATH, (req: Request, res: Response, next: NextFunction) => {
            if (req.session.account) {
                DHLog.d(req.session.account + " logout");
            }
            req.session.destroy((err) => {
                if (err) {
                    DHLog.d("session destroy error:" + err);
                }
            });
            return res.redirect(DHAPI.ROOT_PATH);
        });
    }

    constructor() {
        super();
    }

    public loginPage(req: Request, res: Response, next: NextFunction) {
        this.title = "Home | DHHealthPlatform | Login Success";
        let options: Object = {
            "message": "Welcome to the login"
        };
        this.render(req, res, "login", options);
    }

    public loginSuccess(req: Request, res: Response, next: NextFunction) {
        this.title = "Home | DHHealthPlatform | Login Success";
        let options: Object = {
            "message": "Welcome to the login"
        };
        this.render(req, res, "loginResult", options);
    }

    public loginError(req: Request, res: Response, next: NextFunction) {
        this.title = "Home | DHHealthPlatform | Login Faild";
        let options: Object = {
            "message": "Welcome to the login"
        };
        this.render(req, res, "loginResult", options);
    }
}