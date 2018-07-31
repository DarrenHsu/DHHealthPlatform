import { Schema } from "mongoose";

export var ProfileSchema: Schema = new Schema({
    lineUserId: String,
    displayName: String,
    pictureUrl: String
});