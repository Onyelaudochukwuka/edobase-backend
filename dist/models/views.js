"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const viewSchema = new mongoose_1.Schema({
    reference: {
        type: String,
        required: true,
    },
    views: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now(),
    }
});
exports.default = mongoose_1.models.Views || (0, mongoose_1.model)("Views", viewSchema);
