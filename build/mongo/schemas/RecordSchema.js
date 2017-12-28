"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.RecordSchema = new mongoose_1.Schema({
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
