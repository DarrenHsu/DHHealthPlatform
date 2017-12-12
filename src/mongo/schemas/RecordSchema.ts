import { Schema } from "mongoose";

export var RecordSchema: Schema = new Schema({
    userId: {
        type: String,
        required: true        
    },
    name: String,
    distance: Number,
    startTime: Date,
    endTime: Date,
    avgSpeed: Number,
    maxSpeed: Number,
    locations: [{
        longitude: Number,
        latitude: Number
    }],
    imglocations: [Number],
    createdAt: {
        type: Date,
        default: new Date()
    },
    modifyAt: Date
});