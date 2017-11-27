import { IBase } from "../interface/IBase";
import { IBaseModel } from "../models/model";
import { BaseHelper } from "./BaseHelper";
import { MONGODB_CODE } from "../../routes/ResultCode";

export interface BaseHelper {
    save(id: string, data: IBase);
    save(id: string, data: IBase, callback: (code: MONGODB_CODE, result: IBase) => void);
    save(id: string, data: IBase, callback?: (code: MONGODB_CODE, result: IBase) => void);
    
    add(data: IBase, callback: (code: MONGODB_CODE, result: IBase) => void);

    remove(id: string);
    remove(id: string, callback: (code: MONGODB_CODE) => void);
    remove(id: string, callback?: (code: MONGODB_CODE) => void);

    list(id: string);
    list(id: string, callback: (code: MONGODB_CODE, results: IBase[]) => void);
    list(id: string, callback?: (code: MONGODB_CODE, results: IBase[]) => void);
}