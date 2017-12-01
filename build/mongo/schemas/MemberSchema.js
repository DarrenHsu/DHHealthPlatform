"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.MemberSchema = new mongoose_1.Schema({
    lineUserId: {
        type: String,
        required: true
    },
    displayNmae: String,
    pictureUrl: String,
    createdAt: {
        type: Date,
        required: true,
        default: new Date()
    },
    modifyAt: Date
});
