const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

router.post("/resources", (req, res) => {
    res.json({ success: true });
    console.log("success");
});

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

router.get("/api/user", (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ success: true, user: req.user });
    } else {
        res.status(401).json({ success: false, message: "Unauthorized" });
    }
});

module.exports = router;
