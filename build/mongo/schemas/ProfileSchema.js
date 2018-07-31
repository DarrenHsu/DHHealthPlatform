"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.ProfileSchema = new mongoose_1.Schema({
    lineUserId: String,
    displayName: String,
    pictureUrl: String
});
