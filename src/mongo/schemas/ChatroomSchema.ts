import { Schema } from "mongoose";

export var ChatroomSchema: Schema = new Schema({
    lineUserId: {
        type: String,
        required: true        
    },
    chatId: String,
    type: String,
    createdAt: {
        type: Date,
        default: new Date()
    },
    modifyAt: Date
});