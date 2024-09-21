const express = require("express");
const router = express.Router();

const User = require("../models/transaction");

/**GET: /api/transactions => show all transactions*/
router.get("/", async (req, res, next) => {
    try {
        let transactions = await Transaction.find().sort({ date: -1 });

        return res.json(transactions).status(200); //200: OK
    } catch (err) {
        return res.json(err).status(400); //400: Bad Request
    }
});

/*POST: /api/transactions => create new transaction from http req body */
router.post('/', async (req, res, next) => {
    try {
        const transaction = await Transaction.create(req.body);
        console.log("Transaction created:", transaction); // Log the created transaction
        return res.json(transaction).status(201); // Respond with the created transaction
    } catch (err) {
        console.error("Error creating transaction:", err); // Log any errors that occur during transaction creation
        return res.json(err).status(400); // Respond with the error status and message
    }
});