var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const transaction = new mongoose.Schema({
    name: { type: String, required: true, unqiue: false },
    type: {
        type: String, enum: ['Expense', 'Income'],
        required: true, unqiue: false
    },
    amount: { type: Number, required: true, unqiue: false },
    date: { type: Date, required: true, unqiue: false },
    category: {
        type: String, required: true, unqiue: false,
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

});

module.exports = mongoose.model('Transaction', transaction);