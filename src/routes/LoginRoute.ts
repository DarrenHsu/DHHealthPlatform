import { NextFunction, Request, Response, Router } from "express";
import { DHLog } from "../util/DHLog";
import { BaseRoute } from "./BaseRoute";
import { DHAPI } from "../const/DHAPI";
import { LINEAPI } from "../const/LINEAPI";
import { LINE_CODE, ResultCodeMsg } from "../routes/ResultCode";

export class LoginRoute extends BaseRoute {
    
    constructor() {
        super();
    }

    public static create(router: Router) {
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
                    "scope=openid%20profile";

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

        DHLog.d("[" + this.name + ":create] " + DHAPI.LOGIN_ERROR);
        router.get(DHAPI.LOGIN_ERROR + "/:code" , (req: Request, res: Response, next: NextFunction) => {
            var resultCode = req.params.code;
            if (!resultCode) {
                return new LoginRoute().loginError(req, res, next, ResultCodeMsg.getMsg(LINE_CODE.LL_LOGIN_ERROR));
            }
            
            DHLog.d("login error " + resultCode);
            return new LoginRoute().loginError(req, res, next, ResultCodeMsg.getMsg(parseInt(resultCode)));
        });
    }

    public loginError(req: Request, res: Response, next: NextFunction, msg: String) {
        this.title = "Home | DHHealthPlatform | Login Error";
        let options: Object = {
            "message": msg
        };
        DHLog.d("login msg " + msg);
        this.render(req, res, "login/result", options);
    }
}