"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    date: { type: Date, required: true, default: Date.now() },
    content: { type: String, required: true },
    title: { type: String, required: true },
    views: { type: Number, required: true, default: 0 },
    likes: { type: [String], required: true, default: [] },
    dislikes: { type: [String], required: true, default: [] },
    comments: {
        type: [{
                type: mongoose_1.Types.ObjectId,
                ref: "Comments"
            }],
        required: true,
        default: [],
    },
    topic: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
        ref: "User",
    },
    reports: {
        type: [
            {
                type: { type: String, required: true },
                reason: { type: String, required: true },
            },
        ],
        required: true,
        default: [],
    },
    promoted: {
        type: Boolean,
        required: false
    },
    image: {
        image: Buffer,
        contentType: String,
        required: false,
    },
});
exports.default = mongoose_1.models.Post || (0, mongoose_1.model)("Post", postSchema);
