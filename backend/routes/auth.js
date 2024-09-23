const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const Transaction = require("../models/transaction"); // Correct model name


function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.status(401).json({ success: false, message: "Unauthorized" });
    }
}

router.post("/signup", function (req, res) {
    console.log(req.body);
    User.register(
        new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
        }),
        req.body.password,
        function (err, user) {
            if (err) {
                res.json({
                    success: false,
                    message: "Your account could not be saved. Error: " + err,
                });
            } else {
                req.login(user, (er) => {
                    if (er) {
                        res.json({ success: false, message: er });
                    } else {
                        res.json({
                            success: true,
                            message: "Your account has been saved",
                        });
                    }
                });
            }
        }
    );
});

router.post("/login", function (req, res) {
    if (!req.body.username) {
        res.json({ success: false, message: "Username was not given" });
    } else if (!req.body.password) {
        res.json({ success: false, message: "Password was not given" });
    } else {
        passport.authenticate("local", function (err, user, info) {
            if (err) {
                console.log(err);
                res.json({ success: false, message: err });
            } else {
                if (!user) {
                    res.json({
                        success: false,
                        message: "username or password incorrect",
                    });
                } else {
                    const token = jwt.sign(
                        { userId: user._id, username: user.username },
                        process.env.SECRET_KEY,
                        { expiresIn: "24h" }
                    );
                    res.json({
                        success: true,
                        message: "Authentication successful",
                        token: token,
                    });
                }
            }
        })(req, res);
    }
});

router.post("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        // Successfully logged out
        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    });
});

router.post('/create-transaction', async (req, res) => {
    console.log("Received request to create transaction:", req.body)
    try {
        const transaction = await Transaction.create(req.body);
        console.log("Transaction created:", transaction); // Log the created transaction
        return res.status(201).json(transaction); // Set status before sending response
    } catch (err) {
        console.error("Error creating transaction:", err); // Log any errors that occur
        return res.status(400).json({ error: "Error creating transaction" }); // Send a custom error message
    }
});

router.get("/api/user", (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ success: true, user: req.user });
    } else {
        res.status(401).json({ success: false, message: "Unauthorized" });
    }
});

module.exports = router;
