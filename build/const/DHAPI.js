"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DHAPI {
}
DHAPI.pkgjson = require("../../package.json");
DHAPI.ROOT_PATH = "/";
DHAPI.LOGIN_PATH = "/login";
DHAPI.LOGIN_INPUT_PATH = DHAPI.LOGIN_PATH + "/input";
DHAPI.LOGIN_PROCESS_PATH = DHAPI.LOGIN_PATH + "/process";
DHAPI.LOGIN_KILL_PATH = DHAPI.LOGIN_PATH + "/kill";
DHAPI.LOGIN_ERROR = DHAPI.LOGIN_PATH + "/error";
DHAPI.RECORD_PATH = DHAPI.ROOT_PATH + "record";
DHAPI.API_PATH = DHAPI.ROOT_PATH + "api";
DHAPI.API_RECORD_PATH = DHAPI.API_PATH + "/record";
DHAPI.API_USER_PATH = DHAPI.API_PATH + "/user";
DHAPI.API_ROUTE_PATH = DHAPI.API_PATH + "/route";
exports.DHAPI = DHAPI;
