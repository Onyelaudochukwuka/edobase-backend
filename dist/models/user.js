"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now(),
    },
    gender: {
        type: String,
        required: false,
    },
    image: {
        data: Buffer,
        contentType: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    confirmed: {
        type: Boolean,
        default: false,
    },
    phone: {
        type: String,
        required: false,
    },
    LGA: {
        type: String,
        required: false,
    },
    username: {
        type: String,
        required: false,
    },
    bio: {
        type: String,
        required: false,
    },
    posts: {
        type: [
            {
                type: mongoose_1.Types.ObjectId,
                ref: "Post",
            },
        ],
        required: true,
        default: [],
    },
});
exports.default = mongoose_1.models.User || (0, mongoose_1.model)("User", userSchema);
