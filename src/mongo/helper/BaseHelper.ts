import { IBase } from "../interface/IBase";
import { IBaseModel } from "../models/model";
import { BaseHelper } from "./BaseHelper";

export interface BaseHelper {
    public save(id: string, data: IBase);
    public save(id: string, data: IBase, callback: (code: MONGODB_CODE, result: IBase) => void);
    public save(id: string, data: IBase, callback?: (code: MONGODB_CODE, result: IBase) => void);
    
    public add(data: IBase, callback: (code: MONGODB_CODE, result: IBase) => void);

    public remove(id: string);
    public remove(id: string, callback: (code: MONGODB_CODE) => void);
    public remove(id: string, callback?: (code: MONGODB_CODE) => void);

    public list(id: string);
    public list(id: string, callback: (code: MONGODB_CODE, results: IBase[]) => void);
    public list(id: string, callback?: (code: MONGODB_CODE, results: IBase[]) => void);

}