const mongoose = require("mongoose");
const user = require("./user");
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    name: { type: String, required: true, unique: false },
    type: {
        type: String,
        enum: ['Expense', 'Income'],
        required: true,
        unique: false
    },
    amount: { type: Number, required: true, unique: false },
    date: { type: Date, required: true, unique: false },
    category: {
        type: String,
        required: true,
        unique: false,
        enum: [
            "Housing",
            "Food",
            "Healthcare",
            "Transportation",
            "Entertainment",
            "Education",
            "Debt Payments",
            "Personal Care",
            "Taxes",
            "Other"
        ],
    },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: false }
});

module.exports = mongoose.model('Transaction', transactionSchema);
