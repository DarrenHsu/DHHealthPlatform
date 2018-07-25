import { BaseHelper }   from './BaseHelper';
import { IBase }        from '../interface/IBase';
import { MONGODB_CODE } from '../../routes/ResultCode';

/**
 * @description 父類別
 */
export interface BaseHelper {
    /**
     * @description 儲存程序
     * @param id 
     * @param data 
     */
    save(id: string, data: IBase);
    save(id: string, data: IBase, callback: (code: MONGODB_CODE, result: IBase) => void);
    save(id: string, data: IBase, callback?: (code: MONGODB_CODE, result: IBase) => void);
    
    /**
     * @description 新增程序
     * @param data 
     * @param callback 
     */
    add(data: IBase, callback: (code: MONGODB_CODE, result: IBase) => void);

    /**
     * @description 刪除程序
     * @param id 
     */
    remove(id: string);
    remove(id: string, callback: (code: MONGODB_CODE) => void);
    remove(id: string, callback?: (code: MONGODB_CODE) => void);

    /**
     * @description 查詢程序
     * @param id 
     */
    find(id: string);
    find(id: string, callback: (code: MONGODB_CODE, results: IBase[]) => void);
    find(id: string, callback?: (code: MONGODB_CODE, results: IBase[]) => void);
}