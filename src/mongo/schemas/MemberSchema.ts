import { Schema } from "mongoose";

export var MemberSchema: Schema = new Schema({
    lineUserId: {
        type: String,
        required: true        
    },
    displayNmae: String,
    pictureUrl: String,
    createdAt: {
        type: Date,
        required: true,
        default: new Date()
    },
    modifyAt: Date
});