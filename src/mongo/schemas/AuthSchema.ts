import { Schema } from "mongoose";

export var AuthSchema: Schema = new Schema({
    lineUserId: String,
    googleToken: String,
    googleTokenExpire: Date,
    lineToken: String,
    lineTokenExpire: Date
});