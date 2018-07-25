"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.UserSchema = new mongoose_1.Schema({
    name: String,
    age: Number,
    height: Number,
    weight: Number,
    gmail: {
        type: String,
        required: true
    },
    lineUserId: {
        type: String,
        required: true,
        index: true
    },
    pictureUrl: String,
    modifyAt: Date,
    createdAt: {
        type: Date,
        default: new Date()
    }
});
