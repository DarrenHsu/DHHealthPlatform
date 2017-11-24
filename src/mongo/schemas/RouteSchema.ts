import { Schema } from "mongoose";

export var RouteSchema: Schema = new Schema({
    createdAt: {
        type: Date,
        required: true,
        default: new Date()
    },
    gmail: String,
    name: String,
    startTime: Date,
    endTime: Date
});