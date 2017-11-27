import { Schema } from "mongoose";

export var RouteSchema: Schema = new Schema({
    userId: {
        type: String,
        required: true        
    },
    name: String,
    startTime: Date,
    endTime: Date,
    createdAt: {
        type: Date,
        required: true,
        default: new Date()
    }
});