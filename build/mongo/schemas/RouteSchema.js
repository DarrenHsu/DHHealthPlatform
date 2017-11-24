"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.RouteSchema = new mongoose_1.Schema({
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
