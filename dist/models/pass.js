"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const passSchema = new mongoose_1.Schema({
    user_id: {
        type: String,
        required: true,
    },
    confirmation_id: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    }
});
exports.default = mongoose_1.models.Pass || (0, mongoose_1.model)("Pass", passSchema);
