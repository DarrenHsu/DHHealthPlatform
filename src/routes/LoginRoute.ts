import { NextFunction, Request, Response, Router } from "express";
import { DHLog } from "../util/DHLog";
import { BaseRoute } from "./BaseRoute";
import { DHAPI } from "../const/DHAPI";
import { LINEAPI } from "../const/LINEAPI";

export class LoginRoute extends BaseRoute {
    
    public static create(router: Router) {
        DHLog.d("[" + this.name + ":create] " + DHAPI.LOGIN_INPUT_PATH);
        router.get(DHAPI.LOGIN_INPUT_PATH, (req: Request, res: Response, next: NextFunction) => {
            new LoginRoute().loginPage(req, res, next);
        });

        DHLog.d("[" + this.name + ":create] " + DHAPI.LOGIN_PROCESS_PATH);
        router.get(DHAPI.LOGIN_PROCESS_PATH, (req: Request, res: Response, next: NextFunction) => {
            var act = req.session.account;
            
            if (!act) {
                var fullUrl = this.getFullHostUrl(req);
                var authUrl = encodeURIComponent(fullUrl + LINEAPI.API_LINE_AUTH_PATH);
                var channelId = DHAPI.pkgjson.linelogin.channelId;
                var channelSecret = DHAPI.pkgjson.linelogin.channelSecret;
                var lineApi = LINEAPI.API_AUTHORIZE + "?" +
                    "response_type=code" + "&" +
                    "client_id=" + channelId + "&" +
                    "redirect_uri=" + authUrl + "&" +
                    "state=" + "2018031300001" + "&" +
                    "scope=profile";

                DHLog.d("lineApi " + lineApi);
                
                return res.redirect(lineApi);
            } else {
                var name = req.session.name;
                var picture = req.session.picture;
            
                DHLog.ld("act:" + act + " name:" + name);

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