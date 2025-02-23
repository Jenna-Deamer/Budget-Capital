const mongoose = require("mongoose");
const user = require("./user");
const Category = require("./customCategory");
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["Expense", "Income"],
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
        // Valiate that the category exists and matches the transaction type
        validate: {
            validator: async function (value) {
                try {
                    const category = await Category.findById(value);
                    return category && category.type === this.type;
                } catch (err) {
                    return false;
                }
            },
            // Error message when validation fails
            message: (props) =>
                `Category must exist and match the transaction type`,
        },
    },
    // assign each category to a user
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});

module.exports = mongoose.model("Transaction", transactionSchema);
