import { Schema } from "mongoose";

export var ChatroomSchema: Schema = new Schema({
    chatId: {
        type: String,
        required: true        
    },
    userId: {
        type: String,
        required: true        
    },
    type: String,
    members: [{
        lineUserId: String,
    }],
    createdAt: {
        type: Date,
        required: true,
        default: new Date()
    },
    modifyAt: Date
});