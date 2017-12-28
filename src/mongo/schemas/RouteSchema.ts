import { Schema } from "mongoose";

export var RouteSchema: Schema = new Schema({
    lineUserId: {
        type: String,
        required: true        
    },
    name: String,
    startDate: String,
    startTime: String,
    endTime: String,
    ytbroadcastId: String,
    createdAt: {
        type: Date,
        default: new Date()
    },
    modifyAt: Date
});