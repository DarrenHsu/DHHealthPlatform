import { Document } from "mongoose";
import { IUser } from "../interface/IUser";
import { IRoute } from "../interface/IRoute";
import { IRecord } from "../interface/IRecord";
import { IChatroom } from "../interface/IChatroom";
import { IMember } from "../interface/IMember";

export interface IBaseModel extends Document {}

export interface IUserModel extends IUser, IBaseModel {}

export interface IRecordModel extends IRecord, IBaseModel {}

export interface IRouteModel extends IRoute, IBaseModel {}

export interface IChatroomModel extends IChatroom, IBaseModel {}

export interface IMemberModel extends IMember, IBaseModel {}