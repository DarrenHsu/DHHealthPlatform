export enum LINE_CODE {
    LL_SUCCESS = 0,
    LL_PUSH_MSG_ERROR = -101,
    LL_LOGIN_ERROR = -102,
    LL_MOB_PROFILE_NOT_FOUND_ERROR = -103
}

export enum CONNECTION_CODE {
    CC_SUCCESS = 0,
    CC_PARAMETER_ERROR = -201,
    CC_REQUEST_BODY_ERROR = -202,
    CC_AUTH_ERROR = -203,
    CC_GENERAL_ERROR = -999,
    CC_PAGE_NOT_FOUND_ERROR = -1000
}

export enum GOOGLE_CODE {
    GC_SUCCESS = 0,
    GC_AUTH_ERROR = -301,
    GC_TOKEN_ERROR = -302
}

export enum MONGODB_CODE {
    MC_DATA_EXIST = 1,
    MC_SUCCESS = 0,
    MC_INSERT_ERROR = -1,
    MC_UPDATE_ERROR = -2,
    MC_SELECT_ERROR = -3,
    MC_DELETE_ERROR = -4,
    MC_INSERT_EXIST_ERROR = -5,
    MC_UPDATE_NOT_FOUND_ERROR = -6,
    MC_DELETE_NOT_FOUND_ERROR = -7,
    MC_COUNT_ERROR = -8,
    MC_LIST_NO_DATA_ERROR = -9,
    MC_NO_USER_DATA_ERROR = -97,
    MC_NO_DATA_ERROR = -98,
    MC_NO_CONDITION_ERROR = -99
}

class ResultMsg {
    public static LL_SUCCESS = "執行成功";
    public static LL_PUSH_MSG_ERROR = "發送訊息失敗";
    public static LL_LOGIN_ERROR = "LINE帳號登入失敗，請您確認您的帳園密碼是否正確。";
    public static LL_MOB_PROFILE_NOT_FOUND_ERROR = "請至手機版運動紀錄登入您的LINE帳號後在進行網站登入。";

    public static CC_SUCCESS = "執行成功";
    public static CC_PARAMETER_ERROR = "輸入的參數有誤";
    public static CC_REQUEST_BODY_ERROR = "傳入的資料有誤";
    public static CC_AUTH_ERROR = "認證失敗";
    public static CC_GENERAL_ERROR = "系統發生錯誤，不再繼續執行下去!";
    public static CC_PAGE_NOT_FOUND_ERROR = "找不到此頁面"

    public static MC_DATA_EXIST = "資料已存在";
    public static MC_SUCCESS = "執行成功";
    public static MC_INSERT_ERROR = "新增失敗";
    public static MC_UPDATE_ERROR = "更新失敗";
    public static MC_SELECT_ERROR = "查詢失敗";
    public static MC_DELETE_ERROR = "刪除失敗";
    public static MC_INSERT_EXIST_ERROR = "新增了重覆的資料";
    public static MC_UPDATE_NOT_FOUND_ERROR = "找不到可以更新的資料";
    public static MC_DELETE_NOT_FOUND_ERROR = "找不到可以刪除的資料";
    public static MC_COUNT_ERROR = "取得數量失敗";
    public static MC_LIST_NO_DATA_ERROR = "查無任何資料";
    public static MC_NO_USER_DATA_ERROR = "查無會員資料";
    public static MC_NO_DATA_ERROR = "無傳入處理資料";
    public static MC_NO_CONDITION_ERROR = "無傳入選擇條件";

    public static GC_SUCCESS = "資料已存在";
    public static GC_AUTH_ERROR = "Google 授權失敗!";
    public static GC_TOKEN_ERROR = "Google 取得授權碼失敗";
}

export class ResultCodeMsg {
    public static getMsg(code: number) {
        switch(code) {
            case LINE_CODE.LL_SUCCESS:
                return ResultMsg.LL_SUCCESS;
            case LINE_CODE.LL_PUSH_MSG_ERROR:
                return ResultMsg.LL_PUSH_MSG_ERROR;
            case LINE_CODE.LL_LOGIN_ERROR:
                return ResultMsg.LL_LOGIN_ERROR;
            case LINE_CODE.LL_MOB_PROFILE_NOT_FOUND_ERROR:
                return ResultMsg.LL_MOB_PROFILE_NOT_FOUND_ERROR;

            case CONNECTION_CODE.CC_SUCCESS:
                return ResultMsg.CC_SUCCESS;
            case CONNECTION_CODE.CC_PARAMETER_ERROR:
                return ResultMsg.CC_PARAMETER_ERROR;
            case CONNECTION_CODE.CC_REQUEST_BODY_ERROR:
                return ResultMsg.CC_REQUEST_BODY_ERROR;
            case CONNECTION_CODE.CC_AUTH_ERROR:
                return ResultMsg.CC_AUTH_ERROR;
            case CONNECTION_CODE.CC_GENERAL_ERROR:
                return ResultMsg.CC_GENERAL_ERROR;
            case CONNECTION_CODE.CC_PAGE_NOT_FOUND_ERROR:
                return ResultMsg.CC_PAGE_NOT_FOUND_ERROR;
            
            case GOOGLE_CODE.GC_SUCCESS:
                return ResultMsg.GC_SUCCESS;
            case GOOGLE_CODE.GC_AUTH_ERROR:
                return ResultMsg.GC_AUTH_ERROR;
            case GOOGLE_CODE.GC_TOKEN_ERROR:
                return ResultMsg.GC_TOKEN_ERROR;
            
            case MONGODB_CODE.MC_DATA_EXIST:
                return ResultMsg.MC_DATA_EXIST;
            case MONGODB_CODE.MC_SUCCESS:
                return ResultMsg.MC_SUCCESS;
            case MONGODB_CODE.MC_INSERT_ERROR:
                return ResultMsg.MC_INSERT_ERROR;
            case MONGODB_CODE.MC_UPDATE_ERROR:
                return ResultMsg.MC_UPDATE_ERROR;
            case MONGODB_CODE.MC_SELECT_ERROR:
                return ResultMsg.MC_SELECT_ERROR;
            case MONGODB_CODE.MC_DELETE_ERROR:
                return ResultMsg.MC_DELETE_ERROR;
            case MONGODB_CODE.MC_INSERT_EXIST_ERROR:
                return ResultMsg.MC_INSERT_EXIST_ERROR;
            case MONGODB_CODE.MC_UPDATE_NOT_FOUND_ERROR:
                return ResultMsg.MC_UPDATE_NOT_FOUND_ERROR;
            case MONGODB_CODE.MC_DELETE_NOT_FOUND_ERROR:
                return ResultMsg.MC_DELETE_NOT_FOUND_ERROR;
            case MONGODB_CODE.MC_COUNT_ERROR:
                return ResultMsg.MC_COUNT_ERROR;
            case MONGODB_CODE.MC_LIST_NO_DATA_ERROR:
                return ResultMsg.MC_LIST_NO_DATA_ERROR;
            case MONGODB_CODE.MC_NO_USER_DATA_ERROR:
                return ResultMsg.MC_NO_USER_DATA_ERROR;

            case MONGODB_CODE.MC_NO_DATA_ERROR:
                return ResultMsg.MC_NO_DATA_ERROR;
            case MONGODB_CODE.MC_NO_CONDITION_ERROR:
                return ResultMsg.MC_NO_CONDITION_ERROR;
            default:
                return ResultMsg.MC_SUCCESS;
        }
    }
}

