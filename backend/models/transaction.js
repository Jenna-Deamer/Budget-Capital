var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var TransactionSchema = new Schema({
    name: { type: String, required: true, unique: false },
    type: { type: String, required: true, enum: ["Income", "Expense"] },
    amount: { type: Number, required: true, unique: false, min: 0 },
    category: {
        type: String,
        enum:
            ["Housing",
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
        required: true,
        unique: false
    },
    Date: { type: Date, required: true, unique: false }
});

module.exports = mongoose.model("Transaction", TransactionSchema);