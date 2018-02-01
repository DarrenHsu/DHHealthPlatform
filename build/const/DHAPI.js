"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DHAPI {
}
DHAPI.HOST_NAME = "https://dhhealthplatform.herokuapp.com";
DHAPI.ROOT_PATH = "/";
DHAPI.RECORD_PATH = DHAPI.ROOT_PATH + "record";
DHAPI.API_PATH = DHAPI.ROOT_PATH + "api";
DHAPI.API_RECORD_PATH = DHAPI.API_PATH + "/record";
DHAPI.API_USER_PATH = DHAPI.API_PATH + "/user";
DHAPI.API_ROUTE_PATH = DHAPI.API_PATH + "/route";
DHAPI.API_LINELAUTH_PATH = DHAPI.API_PATH + "/lineauth";
DHAPI.API_LINEBOT_PATH = DHAPI.API_PATH + "/linebot";
DHAPI.API_LINEBOT_PUSH_RECORD_PATH = DHAPI.API_LINEBOT_PATH + "/push/record";
DHAPI.API_LINEBOT_PUSH_MESSAGE_PATH = DHAPI.API_LINEBOT_PATH + "/push/message";
exports.DHAPI = DHAPI;
