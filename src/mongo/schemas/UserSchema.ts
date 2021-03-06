import { Schema } from "mongoose";

export var UserSchema: Schema = new Schema({
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