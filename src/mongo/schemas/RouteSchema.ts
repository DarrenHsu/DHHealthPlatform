import { Schema } from "mongoose";

export var RouteSchema: Schema = new Schema({
    lineUserId: {
        type: String,
        required: true        
    },
    name: String,
    startTime: Date,
    endTime: Date,
    ytbroadcastId: String,
    createdAt: {
        type: Date,
        default: new Date()
    },
    modifyAt: Date
});