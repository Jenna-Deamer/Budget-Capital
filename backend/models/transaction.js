const mongoose = require("mongoose");
const user = require("./user");
const Category = require("./customCategory");
const Schema = mongoose.Schema;

// Keep default categories for reference and initial setup
const incomeCategories = [
    "Salary",
    "Investments",
    "Bonus",
    "Freelancing",
    "Gifts",
    "Other",
];
const expenseCategories = [
    "Housing",
    "Food",
    "Healthcare",
    "Transportation",
    "Entertainment",
    "Education",
    "Debt Payments",
    "Personal Care",
    "Taxes",
    "Other",
];

const transactionSchema = new Schema({
    name: { type: String, required: true, unique: false },
    type: {
        type: String,
        enum: ["Expense", "Income"],
        required: true,
        unique: false,
    },
    amount: { type: Number, required: true, unique: false },
    date: { type: Date, required: true, unique: false },
    category: {
        type: Schema.Types.Mixed, // Allows both String (for defaults) and ObjectId (for custom)
        required: true,
        validate: {
            validator: async function (value) {
                if (typeof value === "string") {
                    // Check if it's a default category
                    if (this.type === "Income") {
                        return incomeCategories.includes(value);
                    } else {
                        return expenseCategories.includes(value);
                    }
                } else {
                    // Check if it's a valid custom category
                    try {
                        const category = await Category.findById(value);
                        return category && category.type === this.type;
                    } catch (err) {
                        return false;
                    }
                }
            },
            message: (props) =>
                `${props.value} is not a valid category for ${props.type}`,
        },
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: false,
    },
});

module.exports = mongoose.model("Transaction", transactionSchema);
