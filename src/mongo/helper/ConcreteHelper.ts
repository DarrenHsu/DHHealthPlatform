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
        model.find(conditions).sort(sort).then((ress) => {
            DHLog.d('find ' + ress.length);
            if (callback) callback(MONGODB_CODE.MC_SUCCESS, ress);
        }).catch((err) => {
            DHLog.d('find error:' + err);
            if (callback) callback(MONGODB_CODE.MC_SELECT_ERROR, null);
        });
    }

    protected modelFindOne(model: mongoose.Model<any>, conditions: Object, callback?: (code: MONGODB_CODE, results: IBase) => void) {
        model.findOne(conditions).then((res) => {
            DHLog.d('find ' + res);
            if (callback) callback(MONGODB_CODE.MC_SUCCESS, res);
        }).catch((err) => {
            DHLog.d('find error:' + err);
            if (callback) callback(MONGODB_CODE.MC_SELECT_ERROR, null);
        });
    }

    protected modelRemove(model: mongoose.Model<any>, conditions: Object, callback?: (code: MONGODB_CODE) => void) {
        model.remove(conditions).then((res) => {
            DHLog.d('remove by id success');
            if (callback) callback(MONGODB_CODE.MC_SUCCESS);                    
        }).catch((err) => {
            DHLog.d('remove by id error：' + err);
            if (callback) callback(MONGODB_CODE.MC_DELETE_ERROR);               
        })
    }
}