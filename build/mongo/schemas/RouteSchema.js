"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.RouteSchema = new mongoose_1.Schema({
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
