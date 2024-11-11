const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const budgetSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    month: { type: String, required: true },
    year: { type: Number, required: true },
    targetAmount: { type: Number, required: true },
    actualAmount: { type: Number, default: 0 },
});

module.exports = mongoose.model("Budget", budgetSchema);
