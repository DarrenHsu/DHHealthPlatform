import { Document } from "mongoose";
import { IUser } from "../interface/IUser";
import { IRoute } from "../interface/IRoute";
import { IRecord } from "../interface/IRecord";

export interface IUserModel extends IUser, Document {}

export interface IRecordModel extends IRecord, Document {}

export interface IRoute extends IRoute, Document {}