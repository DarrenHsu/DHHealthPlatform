"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.RouteSchema = new mongoose_1.Schema({
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
