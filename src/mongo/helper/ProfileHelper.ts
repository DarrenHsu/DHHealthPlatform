import * as mongoose        from 'mongoose';

import { ConcreteHelper }   from './ConcreteHelper';

import { IProfile }         from '../interface/IProfile';
import { ProfileSchema }    from '../schemas/ProfileSchema';
import { IProfileModel }   from '../models/model';

import { MONGODB_CODE }     from '../../routes/ResultCode';
import { DHLog }            from '../../util/DHLog';

/**
 * @description line chat 資料存取控制
 */
export class ProfileHelper extends ConcreteHelper {
    
    private static model: mongoose.Model<IProfileModel>;

    constructor(connection: mongoose.Connection) {
        super(connection);
        
        if (!ProfileHelper.model)  {
            ProfileHelper.model = connection.model<IProfileModel>('profile', ProfileSchema);
        }
    }

    public save(id: string, data: IProfile, callback?: (code: MONGODB_CODE, result: IProfileModel) => void) {
        if (!data || !id) {
            DHLog.d('data error：' + data);
            if (callback) callback(MONGODB_CODE.MC_NO_DATA_ERROR, null);
            return;
        }
        
        ProfileHelper.model.findByIdAndUpdate(id, data).then((res) => {
            if (!res) {
                DHLog.d('not update');
                if (callback) callback(MONGODB_CODE.MC_UPDATE_NOT_FOUND_ERROR, null);
                return;
            }

            DHLog.d('update:' + res._id);
            res.lineUserId = data.lineUserId;
            res.displayName = data.displayName;
            res.pictureUrl = data.pictureUrl;
            res.save();

            if (callback) callback(MONGODB_CODE.MC_SUCCESS, res);
        }).catch((err) => {
            DHLog.d('find by id and update error：' + err);
            if (callback) callback(MONGODB_CODE.MC_SELECT_ERROR, null);
        });
    }

    public add(data: IProfile, callback: (code: MONGODB_CODE, result: IProfile) => void) {
        if (!data) {
            DHLog.d('add data error ' + data);
            if (callback) callback(MONGODB_CODE.MC_NO_DATA_ERROR, null);
            return;
        }

        ProfileHelper.model.update({lineUserId: data.lineUserId}, data, {multi: true}).then((raw) => {
            if (raw && (raw.n > 0 || raw.nModified > 0)) {
                DHLog.d('update exist data');
                if (callback) callback(MONGODB_CODE.MC_SUCCESS, data);
                return;
            }

            new ProfileHelper.model(data).save().then((res) => {
                DHLog.d('add data:' + JSON.stringify(res));
                if (callback) callback(MONGODB_CODE.MC_SUCCESS, res);
            }).catch((err) => {
                DHLog.d('add error' + err);
                if (callback) callback(MONGODB_CODE.MC_INSERT_ERROR, null);
            })
        }).catch((err) => {
            DHLog.d('count error:' + err);
            if (callback) callback(MONGODB_CODE.MC_COUNT_ERROR, null);
        });        
    }

    public remove(id: string, callback?: (code: MONGODB_CODE) => void) {
        if (!id) {
            DHLog.d('id error：' + id);
            if (callback) callback(MONGODB_CODE.MC_NO_CONDITION_ERROR);
            return;
        }

        this.modelRemove(ProfileHelper.model, {_id : id}, callback);
    }

    public find(lineUserId: string, callback?: (code: MONGODB_CODE, results: IProfileModel[]) => void) {
        if (!lineUserId) {
            DHLog.d('id error：' + lineUserId);
            if (callback) callback(MONGODB_CODE.MC_NO_CONDITION_ERROR, null);
            return;
        }

        this.modelFind(ProfileHelper.model, {lineUserId: lineUserId}, null, callback);
    }
}