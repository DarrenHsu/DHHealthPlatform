import * as mongoose        from 'mongoose';

import { ConcreteHelper }   from './ConcreteHelper';

import { IUser }            from '../interface/IUser';
import { UserSchema }       from '../schemas/UserSchema';
import { IUserModel }       from '../models/model';

import { MONGODB_CODE }     from '../../routes/ResultCode';
import { DHLog }            from '../../util/DHLog';

/**
 * @description 使用者資料存取控制
 */
export class UserHelper extends ConcreteHelper {
    
    private static model: mongoose.Model<IUserModel>;
    
    constructor(connection: mongoose.Connection) {
        super(connection);

        if (!UserHelper.model)  {
            UserHelper.model = connection.model<IUserModel>('user', UserSchema);
        }
    }

    public save(id: string, data: IUser, callback?: (code: MONGODB_CODE, result: IUserModel) => void) {
        if (!id) {
            DHLog.d('id error：' + id);
            if (callback) callback(MONGODB_CODE.MC_NO_CONDITION_ERROR, null);
            return;
        }
        
        UserHelper.model.findByIdAndUpdate(id, data).then((res) => {
            if (res) {
                DHLog.d('find one and update');
                res.name = data.name;
                res.age = data.age;
                res.height = data.height;
                res.weight = data.weight;
                res.gmail = data.gmail;
                res.lineUserId = data.lineUserId;
                res.pictureUrl = data.pictureUrl;
                res.modifyAt = new Date();
                res.save();
                
                if (callback) callback(MONGODB_CODE.MC_SUCCESS, res);
            }else {
                DHLog.d('not find');
                if (callback) callback(MONGODB_CODE.MC_UPDATE_NOT_FOUND_ERROR, null);
            }
        }).catch((err) => {
            DHLog.d('find by id and update error：' + err);
            if (callback) callback(MONGODB_CODE.MC_SELECT_ERROR, null);
        })
    }
    
    public add(data: IUser, callback: (code: MONGODB_CODE, result: IUserModel) => void) {
        if (!data || !data.lineUserId) {
            DHLog.d('add data error ' + data);
            if (callback) callback(MONGODB_CODE.MC_NO_DATA_ERROR, null);
            return;
        }

        UserHelper.model.count({lineUserId: data.lineUserId}).then((count) => {
            if (count > 0) {
                DHLog.d('data exist!');
                if (callback) callback(MONGODB_CODE.MC_DATA_EXIST, null);
                return;
            }
                
            new UserHelper.model(data).save().then((res) => {
                DHLog.d('add data: ' + JSON.stringify(res));
                if (callback) callback(MONGODB_CODE.MC_SUCCESS, res);
            }).catch((err) => {
                DHLog.d('add error:' + err);
                if (callback) callback(MONGODB_CODE.MC_INSERT_ERROR, null);
            })
        }).catch((err) => {
            DHLog.d('count error:' + err);
            if (callback) callback(MONGODB_CODE.MC_COUNT_ERROR, null);
        })
    }

    public remove(id: string, callback?: (code: MONGODB_CODE) => void) {
        if (!id) {
            DHLog.d('id error：' + id);
            if (callback) callback(MONGODB_CODE.MC_NO_CONDITION_ERROR);
            return;
        }

        this.modelRemove(UserHelper.model, {_id: id}, callback);
    }

    public find(lineUserId: string, callback?: (code: MONGODB_CODE, results: IUserModel[]) => void) {
        if (!lineUserId) {
            DHLog.d('id error：' + lineUserId);
            if (callback) callback(MONGODB_CODE.MC_NO_CONDITION_ERROR, null);
            return;
        }

        UserHelper.model.find({lineUserId: lineUserId}).then((ress) => {
            DHLog.d('find ' + ress.length);
            if (ress.length == 0) {
                if (callback) callback(MONGODB_CODE.MC_NO_USER_DATA_ERROR, null);
            } else  {
                if (callback) callback(MONGODB_CODE.MC_SUCCESS, ress);
            }
        }).catch((err) => {
            DHLog.d('find error:' + err);
            if (callback) callback(MONGODB_CODE.MC_SELECT_ERROR, null);                    
        })
    }
}