import * as mongoose from 'mongoose';

import { IUserModel, IRouteModel, IRecordModel } from '../models/model';

import { BaseHelper }   from './BaseHelper';
import { IRoute }       from '../interface/IRoute';
import { RouteSchema }  from '../schemas/RouteSchema';
import { MONGODB_CODE } from '../../routes/ResultCode';
import { DHLog }        from '../../util/DHLog';

/**
 * @description 行程資料存取控制
 */
export class RouteHelper implements BaseHelper {
    
    private static model: mongoose.Model<IRouteModel>;

    constructor(connection: mongoose.Connection) {
        if (!RouteHelper.model)  {
            RouteHelper.model = connection.model<IRouteModel>('route', RouteSchema);
        }
    }

    public save(id: string, data: IRoute, callback?: (code: MONGODB_CODE, result: IRouteModel) => void) {
        if (!id) {
            DHLog.d('id error：' + id);
            if (callback) callback(MONGODB_CODE.MC_NO_CONDITION_ERROR, null);
            return;
        }
        
        RouteHelper.model.findByIdAndUpdate(id, data, (err, res) => {
            if (err) {
                DHLog.d('find by id and update error：' + err);
                if (callback) callback(MONGODB_CODE.MC_SELECT_ERROR, null);
                return;
            }

            if (res) {
                DHLog.d('find');
                res.name = data.name;
                res.lineUserId = data.lineUserId;
                res.startTime = data.startTime;
                res.endTime = data.endTime;
                res.modifyAt = new Date();
                res.save();

                if (callback) callback(MONGODB_CODE.MC_SUCCESS, res);
            }else {
                DHLog.d('not find');
                if (callback) callback(MONGODB_CODE.MC_UPDATE_NOT_FOUND_ERROR, null);
            }
        });
    }

    public add(data: IRoute, callback: (code: MONGODB_CODE, result: IRouteModel) => void) {
        if (!data) {
            DHLog.d('add data error ' + data);
            if (callback) callback(MONGODB_CODE.MC_NO_DATA_ERROR, null);
            return;
        }
        
        new RouteHelper.model(data).save((err, res, count) => {
            if (err) {
                DHLog.d('add error' + err);
                if (callback) callback(MONGODB_CODE.MC_INSERT_ERROR, null);
            }else {
                DHLog.d('add data:' + JSON.stringify(res));
                if (callback) callback(MONGODB_CODE.MC_SUCCESS, res);
            }
        });
    }

    public remove(id: string, callback?: (code: MONGODB_CODE) => void) {
        if (!id) {
            DHLog.d('id error：' + id);
            if (callback) callback(MONGODB_CODE.MC_NO_CONDITION_ERROR);
            return;
        }

        this.modelRemove({_id: id}, callback);
    }

    public find(lineUserId: string, callback?: (code: MONGODB_CODE, results: IRouteModel[]) => void) {
        if (!lineUserId) {
            DHLog.d('id error：' + lineUserId);
            if (callback) callback(MONGODB_CODE.MC_NO_CONDITION_ERROR, null);
            return;
        }

        this.modelFind({lineUserId: lineUserId}, callback);
    }

    /* --------------- model 處理程序 ------------------ */
    private modelFind(conditions: Object, callback?: (code: MONGODB_CODE, results: IRouteModel[]) => void) {
        RouteHelper.model.find(conditions, (err, ress) => {
            if (err) {
                DHLog.d('find error:' + err);
                if (callback) callback(MONGODB_CODE.MC_SELECT_ERROR, null);
            }else {
                DHLog.d('find ' + ress.length);
                if (callback) callback(MONGODB_CODE.MC_SUCCESS, ress);
            }
        });
    }

    private modelRemove(conditions: Object, callback?: (code: MONGODB_CODE) => void) {
        RouteHelper.model.remove(conditions, (err) => {
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