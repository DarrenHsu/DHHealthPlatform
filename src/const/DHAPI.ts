export class DHAPI {

    public static pkgjson =                         require('../../package.json');

    public static PROD_HOST =                       'dhhealthplatform.herokuapp.com';
    public static DEV_HOST =                        'localhost:5000';

    public static ROOT_PATH =                       '/';

    public static HOME_PATH =                       '/home';
    
    public static LOGIN_PATH =                      '/login';
    public static LOGIN_INPUT_PATH =                DHAPI.LOGIN_PATH + '/input';
    public static LOGIN_PROCESS_PATH =              DHAPI.LOGIN_PATH + '/process';
    public static LOGIN_KILL_PATH =                 DHAPI.LOGIN_PATH + '/kill';
    public static LOGIN_RESULT_PATH =               DHAPI.LOGIN_PATH + '/result';
    
    public static CALENDAR_PATH =                   '/calendar';
    public static CALENDAR_FEED_PATH =              DHAPI.CALENDAR_PATH + '/feed';
    
    public static RECORD_PATH =                     '/records';
    public static RECORD_PREVIEW_PATH =             DHAPI.RECORD_PATH + '/preview';

    public static LIVE_PATH =                       '/live';

    public static ERROR_PATH =                      '/error';

    public static API_PATH =                        DHAPI.ROOT_PATH + 'api';
    public static API_RECORD_PATH =                 DHAPI.API_PATH + '/record';
    public static API_USER_PATH =                   DHAPI.API_PATH + '/user';
    public static API_ROUTE_PATH =                  DHAPI.API_PATH + '/route';
}