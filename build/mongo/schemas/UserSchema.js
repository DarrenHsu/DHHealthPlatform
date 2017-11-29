"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.UserSchema = new mongoose_1.Schema({
    createdAt: {
        type: Date,
        required: true,
        default: new Date()
    },
    name: String,
    age: Number,
    height: Number,
    weight: Number,
    gmail: {
        type: String,
        required: true
    },
    gAccessToken: {
        type: String,
        required: true
    },
    modifyAt: Date
});