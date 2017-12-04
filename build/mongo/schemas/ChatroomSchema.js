"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.ChatroomSchema = new mongoose_1.Schema({
    lineUserId: {
        type: String,
        required: true
    },
    chatId: String,
    type: String,
    createdAt: {
        type: Date,
        required: true,
        default: new Date()
    },
    modifyAt: Date
});
