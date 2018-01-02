import { Schema } from "mongoose";

export var RecordSchema: Schema = new Schema({
    lineUserId: {
        type: String,
        required: true        
    },
    name: String,
    recordId: String,
    locality: String,
    distance: Number,
    startTime: Date,
    endTime: Date,
    avgSpeed: Number,
    maxSpeed: Number,
    altitude: Number,
    locations: [[Number, Number]],
    imglocations: [Number],
    createdAt: {
        type: Date,
        default: new Date()
    },
    modifyAt: Date
});