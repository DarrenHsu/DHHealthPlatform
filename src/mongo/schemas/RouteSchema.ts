import { Schema } from "mongoose";

export var RouteSchema: Schema = new Schema({
    userId: {
        type: String,
        required: true        
    },
    name: String,
    startTime: Date,
    endTime: Date,
    ytbroadcastId?: String,
    createdAt: {
        type: Date,
        required: true,
        default: new Date()
    },
    modifyAt?: Date
});