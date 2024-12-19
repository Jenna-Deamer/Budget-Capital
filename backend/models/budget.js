const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema({
    amount: { 
        type: Number, 
        required: true 
    },
    month: { 
        type: String, 
        required: true 
    },
    year: { 
        type: Number, 
        required: true 
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }
});

module.exports = mongoose.model('Budget', budgetSchema);

