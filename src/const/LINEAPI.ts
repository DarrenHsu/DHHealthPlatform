import { DHAPI } from './DHAPI';

export class LINEAPI {
    public static API_AUTHORIZE     = 'https://access.line.me/oauth2/v2.1/authorize';
    public static API_ACCESS_TOKEN  = 'https://api.line.me/oauth2/v2.1/token';
    public static API_PROFILE       = 'https://api.line.me/v2/profile';

    public static API_LINE_AUTH_PATH =              DHAPI.API_PATH + '/lineauth';
    public static API_LINE_PROFILE_PATH =           DHAPI.API_PATH + '/lineprofile';

    public static API_LINEBOT_PATH =                DHAPI.API_PATH + '/linebot';
    public static API_LINEBOT_PUSH_RECORD_PATH =    LINEAPI.API_LINEBOT_PATH + '/push/record';
    public static API_LINEBOT_PUSH_MESSAGE_PATH =   LINEAPI.API_LINEBOT_PATH + '/push/message';
    public static API_LINEBOT_PUSH_TEMPLETE_PATH =  LINEAPI.API_LINEBOT_PATH + '/push/templete';
    public static API_LINEBOT_PUSH_FLEX_PATH =      LINEAPI.API_LINEBOT_PATH + '/push/flex';
}