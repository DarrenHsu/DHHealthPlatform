export interface IAuth {
    path: string;
    checkLogin: boolean;
    account?: string;
    name?: string;
    picture?: string;
    loginTime?: string;
}