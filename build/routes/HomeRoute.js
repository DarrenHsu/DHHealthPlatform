"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
const BaseRoute_1 = require("./BaseRoute");
const RecordHelper_1 = require("../mongo/helper/RecordHelper");
const DHDateFormat_1 = require("../const/DHDateFormat");
const DBHelper_1 = require("../mongo/helper/DBHelper");
const DHAPI_1 = require("../const/DHAPI");
const DHLog_1 = require("../util/DHLog");
/**
 * @description 首頁路由控制
 */
class HomeRoute extends BaseRoute_1.BaseRoute {
    constructor(connection) {
        super();
        this.recordHelper = new RecordHelper_1.RecordHelper(connection);
    }
    static create(router) {
        var app = new HomeRoute(DBHelper_1.DBHelper.connection);
        app.getIndex(router);
        app.getHome(router);
    }
    /**
     * @description 首頁畫面
     * @param router
     */
    getIndex(router) {
        DHLog_1.DHLog.d('[' + HomeRoute.name + ':create] ' + DHAPI_1.DHAPI.ROOT_PATH);
        router.get(DHAPI_1.DHAPI.ROOT_PATH, (req, res, next) => {
            if (!this.checkLogin(req, res, next)) {
                return;
            }
            var today = moment().startOf('day');
            var decreaseMonth = moment(today).add(-1, 'M').format(DHDateFormat_1.DHDateFormat.DATE_FORMAT);
            let condition = {
                lineUserId: req.session.account,
                startTime: { '$gte': decreaseMonth }
            };
            let sort = {
                startTime: -1
            };
            this.recordHelper.findWith(condition, sort, (Code, records) => {
                this.renderHome(req, res, next, records);
            });
        });
    }
    /**
     * @description 首頁畫面
     * @param router
     */
    getHome(router) {
        DHLog_1.DHLog.d('[' + HomeRoute.name + ':create] ' + DHAPI_1.DHAPI.HOME_PATH);
        router.get(DHAPI_1.DHAPI.HOME_PATH, (req, res, next) => {
            if (!this.checkLogin(req, res, next)) {
                return;
            }
            this.renderHome(req, res, next, []);
        });
    }
    renderHome(req, res, next, records) {
        let imgLocations = [];
        for (let record of records) {
            for (let lindex of record.imglocations) {
                let location = record.locations[lindex];
                imgLocations.push({ lat: location[0], lon: location[1] });
            }
        }
        DHLog_1.DHLog.d("img locations: " + imgLocations.length);
        this.title = BaseRoute_1.BaseRoute.AP_TITLE;
        let options = {
            auth: this.getAuth(req, DHAPI_1.DHAPI.HOME_PATH, true),
            account: req.session.account,
            name: req.session.name,
            picture: req.session.picture,
            imgLocation: imgLocations
        };
        this.render(req, res, 'home/index', options);
    }
}
exports.HomeRoute = HomeRoute;
