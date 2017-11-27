"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.RecordSchema = new mongoose_1.Schema({
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
    imglocations: [{
            longitude: Number,
            latitude: Number
        }],
    createdAt: {
        type: Date,
        required: true,
        default: new Date()
    }
});
