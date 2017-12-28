import { Schema } from "mongoose";

export var RecordSchema: Schema = new Schema({
    lineUserId: {
        type: String,
        required: true        
    },
    name: String,
    distance: Number,
    startDate: String,
    startTime: String,
    endTime: String,
    avgSpeed: Number,
    maxSpeed: Number,
    locations: [Number, Number],
    imglocations: [Number],
    createdAt: {
        type: Date,
        default: new Date()
    },
    modifyAt: Date
});