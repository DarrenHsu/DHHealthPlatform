import { Schema } from "mongoose";

export var RecordSchema: Schema = new Schema({
    createdAt: {
        type: Date,
        required: true,
        default: new Date()
    },
    gmail: {
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
    imglocations: [{
        longitude: Number,
        latitude: Number
    }]
});