export class DHAPI {

    public static pkgjson =                         require("../../package.json");

    public static HOST_NAME =                       "https://dhhealthplatform.herokuapp.com";
    public static ROOT_PATH =                       "/";
    public static LOGIN_PATH =                      "/login";
    public static LOGIN_INPUT_PATH =                DHAPI.LOGIN_PATH + "/input";
    public static LOGIN_PROCESS_PATH =              DHAPI.LOGIN_PATH + "/process";
    public static LOGIN_KILL_PATH =                 DHAPI.LOGIN_PATH + "/kill";
    public static RECORD_PATH =                     DHAPI.ROOT_PATH + "record";

    public static API_PATH =                        DHAPI.ROOT_PATH + "api";
    public static API_RECORD_PATH =                 DHAPI.API_PATH + "/record";
    public static API_USER_PATH =                   DHAPI.API_PATH + "/user";
    public static API_ROUTE_PATH =                  DHAPI.API_PATH + "/route";
    
    public static API_LINELAUTH_PATH =              DHAPI.API_PATH + "/lineauth";

    public static API_LINEBOT_PATH =                DHAPI.API_PATH + "/linebot";
    public static API_LINEBOT_PUSH_RECORD_PATH =    DHAPI.API_LINEBOT_PATH + "/push/record";
    public static API_LINEBOT_PUSH_MESSAGE_PATH =   DHAPI.API_LINEBOT_PATH + "/push/message";
}