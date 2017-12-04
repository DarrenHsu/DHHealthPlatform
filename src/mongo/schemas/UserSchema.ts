import { Schema } from "mongoose";

export var UserSchema: Schema = new Schema({
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
    lineUserId: {
        type: String,
        required: true
    },
    modifyAt: Date
});