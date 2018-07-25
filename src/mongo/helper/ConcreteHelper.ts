import * as mongoose        from 'mongoose';

import { BaseHelper }       from './BaseHelper';

import { MONGODB_CODE }     from '../../routes/ResultCode';
import { DHLog }            from '../../util/DHLog';
import { IBase }            from '../interface/IBase';

/**
 * @description 紀錄資料存取控制
 */
export class ConcreteHelper implements BaseHelper {
    
    constructor(connection: mongoose.Connection) {}

    public save(id: string, data: IBase, callback?: (code: MONGODB_CODE, result: IBase) => void) {}
    public add(data: IBase, callback: (code: MONGODB_CODE, result: IBase) => void) {}
    public remove(id: string, callback?: (code: MONGODB_CODE) => void) {}
    public find(id: string, callback?: (code: MONGODB_CODE, results: IBase[]) => void) {}

    /* --------------- model 處理程序 ------------------ */
    protected modelFind(model: mongoose.Model<any>, conditions: Object, sort: Object, callback?: (code: MONGODB_CODE, results: IBase[]) => void) {
        model.find(conditions , (err, ress) => {
            if (err) {
                DHLog.d('find error:' + err);
                if (callback) callback(MONGODB_CODE.MC_SELECT_ERROR, null);
            }else {
                DHLog.d('find ' + ress.length);
                if (callback) callback(MONGODB_CODE.MC_SUCCESS, ress);
            }
        }).sort(sort);
    }

    protected modelFindOne(model: mongoose.Model<any>, conditions: Object, callback?: (code: MONGODB_CODE, results: IBase) => void) {
        model.findOne(conditions , (err, res) => {
            if (err) {
                DHLog.d('find error:' + err);
                if (callback) callback(MONGODB_CODE.MC_SELECT_ERROR, null);
            }else {
                DHLog.d('find ' + res);
                if (callback) callback(MONGODB_CODE.MC_SUCCESS, res);
            }
        });
    }

    protected modelRemove(model: mongoose.Model<any>, conditions: Object, callback?: (code: MONGODB_CODE) => void) {
        model.remove(conditions, (err) => {
            if (err) {
                DHLog.d('remove by id error：' + err);
                if (callback) callback(MONGODB_CODE.MC_DELETE_ERROR);               
            }else {
                DHLog.d('remove by id success');
                if (callback) callback(MONGODB_CODE.MC_SUCCESS);                    
            }
        });
    }
}