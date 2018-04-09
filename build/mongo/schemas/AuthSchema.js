"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.AuthSchema = new mongoose_1.Schema({
    lineUserId: String,
    googleToken: String,
    googleTokenExpire: Date,
    lineToken: String,
    lineTokenExpire: Date
});
