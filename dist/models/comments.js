"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongodb_1 = require("mongodb");
const commentSchema = new mongoose_1.Schema({
    refPost: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now() },
    content: { type: String, required: true },
    likes: { type: [String], required: true, default: [] },
    dislikes: { type: [String], required: true, default: [] },
    replyTo: { type: String, required: false },
    author: {
        type: mongodb_1.ObjectId,
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
    }
});
exports.default = mongoose_1.models.Comments || (0, mongoose_1.model)("Comments", commentSchema);
