import { Document } from 'mongoose';
import { IUser } from '../interface/IUser';
import { IRoute } from '../interface/IRoute';
import { IRecord } from '../interface/IRecord';
import { IChatroom } from '../interface/IChatroom';
import { IAuth } from '../interface/IAuth';
import { IProfile } from '../interface/IProfile';

export interface IBaseModel extends Document {}

export interface IUserModel extends IUser, IBaseModel {}

export interface IRecordModel extends IRecord, IBaseModel {}

export interface IProfileModel extends IProfile, IBaseModel {}

export interface IRouteModel extends IRoute, IBaseModel {}

export interface IChatroomModel extends IChatroom, IBaseModel {}

export interface IAuthModel extends IAuth, IBaseModel {}