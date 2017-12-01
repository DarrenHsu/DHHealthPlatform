"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.ChatroomSchema = new mongoose_1.Schema({
    chatId: String,
    userId: {
        type: String,
        required: true
    },
    type: String,
    members: [{
            lineUserId: String,
        }],
    createdAt: {
        type: Date,
        required: true,
        default: new Date()
    },
    modifyAt: Date
});
