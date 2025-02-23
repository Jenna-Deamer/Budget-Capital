const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unqiue: true, // Ensure unique category names
    },
    type: {
        type: String,
        enum: ["Income", "Expense"],
        required: true,
    },
    color: {
        type: String,
        required: true,
        default: "#000000", // Default color
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    isDefault: {
        type: Boolean,
        default: false, // To distinguish between system defaults and custom ones
    },
});

// Compound index to ensure unique categories per user
categorySchema.index({ name: 1, user: 1, type: 1 }, { unique: true });

module.exports = mongoose.model("Category", categorySchema);
