const mongoose = require("mongoose");
const user = require("./user");
const Schema = mongoose.Schema;

const incomeCategories = [
    "Salary",
    "Investments",
    "Bonus",
    "Freelancing",
    "Gifts",
    "Other"
]
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
    "Other"
];

// Custom validation for categories based on type
const validateCategory = function (value, transactionType) {
    if (transactionType === 'Income') {
        return incomeCategories.includes(value);
    } else if (transactionType === 'Expense') {
        return expenseCategories.includes(value);
    }
    return false;
};

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
    // Category validation is based on the type of transaction
    category: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return validateCategory(value, this.type); // `this` refers to the current document
            },
            message: props => `${props.value} is not a valid category for ${props.instance.type}.`
        }
    },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: false }
});

module.exports = mongoose.model('Transaction', transactionSchema);
