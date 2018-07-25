import * as mongoose    from 'mongoose';

import { ConcreteHelper }   from './ConcreteHelper';

import { IAuth }        from '../interface/IAuth';
import { AuthSchema }   from '../schemas/AuthSchema';
import { IAuthModel }   from '../models/model';

import { MONGODB_CODE } from '../../routes/ResultCode';
import { DHLog }        from '../../util/DHLog';

/**
 * @description 授權資料存取控制
 */
export class AuthHelper extends ConcreteHelper {
    
    private static model: mongoose.Model<IAuthModel>;
    
    constructor(connection: mongoose.Connection) {
        super(connection);

        if (!AuthHelper.model)  {
            AuthHelper.model = connection.model<IAuthModel>('Auth', AuthSchema);
        }
    }

    public save(id: string, data: IAuth, callback?: (code: MONGODB_CODE, result: IAuthModel) => void) {
        if (!id) {
            DHLog.d('id error：' + id);
            if (callback) callback(MONGODB_CODE.MC_NO_CONDITION_ERROR, null);
            return;
        }
        
        AuthHelper.model.findByIdAndUpdate(id, data, (err, res) => {
            if (err) {
                DHLog.d('find by id and update error：' + err);
                if (callback) callback(MONGODB_CODE.MC_SELECT_ERROR, null);
                return;
            }

            if (res) {
                DHLog.d('find');
                res.googleToken = data.googleToken;
                res.googleTokenExpire = data.googleTokenExpire;
                res.lineToken = data.lineToken;
                res.lineTokenExpire = data.lineTokenExpire;
                res.save();
                
                if (callback) callback(MONGODB_CODE.MC_SUCCESS, res);
            }else {
                DHLog.d('not find');
                if (callback) callback(MONGODB_CODE.MC_UPDATE_NOT_FOUND_ERROR, null);
            }
        });
    }
    
    public add(data: IAuth, callback: (code: MONGODB_CODE, result: IAuthModel) => void) {
        if (!data || !data.lineUserId) {
            DHLog.d('add data error ' + data);
            if (callback) callback(MONGODB_CODE.MC_NO_DATA_ERROR, null);
            return;
        }

        AuthHelper.model.count({lineUserId: data.lineUserId}, (err, count) => {
            if (err) {
                DHLog.d('count error:' + err);
                if (callback) callback(MONGODB_CODE.MC_COUNT_ERROR, null);
                return;
            }
            
            if (count > 0) {
                DHLog.d('data exist!');
                if (callback) callback(MONGODB_CODE.MC_DATA_EXIST, null);
            }else {
                new AuthHelper.model(data).save((err, res, count) => {
                    if (err) {
                        DHLog.d('add error:' + err);
                        if (callback) callback(MONGODB_CODE.MC_INSERT_ERROR, null);
                    }else {
                        DHLog.d('add data: ' + JSON.stringify(res));
                        if (callback) callback(MONGODB_CODE.MC_SUCCESS, res);
                    }
                });
            }
        });
    }

    public remove(id: string, callback?: (code: MONGODB_CODE) => void) {
        if (!id) {
            DHLog.d('id error：' + id);
            if (callback) callback(MONGODB_CODE.MC_NO_CONDITION_ERROR);
            return;
        }

        this.modelRemove(AuthHelper.model, {_id: id}, callback);
    }

    public findOne(lineUserId: string, callback?: (code: MONGODB_CODE, results: IAuthModel) => void) {
        if (!lineUserId) {
            DHLog.d('id error：' + lineUserId);
            if (callback) callback(MONGODB_CODE.MC_NO_CONDITION_ERROR, null);
            return;
        }

        this.modelFindOne(AuthHelper.model, {lineUserId: lineUserId}, callback);
    }

    public find(lineUserId: string, callback?: (code: MONGODB_CODE, results: IAuthModel[]) => void) {
        if (!lineUserId) {
            DHLog.d('id error：' + lineUserId);
            if (callback) callback(MONGODB_CODE.MC_NO_CONDITION_ERROR, null);
            return;
        }

        AuthHelper.model.find({lineUserId: lineUserId}, (err, ress) => {
            if (err) {
                DHLog.d('find error:' + err);
                if (callback) callback(MONGODB_CODE.MC_SELECT_ERROR, null);                    
            }else {
                DHLog.d('find ' + ress.length);
                if (ress.length == 0) {
                    if (callback) callback(MONGODB_CODE.MC_NO_USER_DATA_ERROR, null);
                } else  {
                    if (callback) callback(MONGODB_CODE.MC_SUCCESS, ress);
                }
            }
        });
    }
}