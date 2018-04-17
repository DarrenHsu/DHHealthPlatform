"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DHAPI_1 = require("./DHAPI");
class LINEAPI {
}
LINEAPI.API_AUTHORIZE = 'https://access.line.me/oauth2/v2.1/authorize';
LINEAPI.API_ACCESS_TOKEN = 'https://api.line.me/oauth2/v2.1/token';
LINEAPI.API_PROFILE = 'https://api.line.me/v2/profile';
LINEAPI.API_LINE_AUTH_PATH = DHAPI_1.DHAPI.API_PATH + '/lineauth';
LINEAPI.API_LINE_PROFILE_PATH = DHAPI_1.DHAPI.API_PATH + '/lineprofile';
LINEAPI.API_LINEBOT_PATH = DHAPI_1.DHAPI.API_PATH + '/linebot';
LINEAPI.API_LINEBOT_PUSH_RECORD_PATH = LINEAPI.API_LINEBOT_PATH + '/push/record';
LINEAPI.API_LINEBOT_PUSH_MESSAGE_PATH = LINEAPI.API_LINEBOT_PATH + '/push/message';
exports.LINEAPI = LINEAPI;
