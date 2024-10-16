const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

// Signup route
router.post("/signup", async (req, res) => {
    const { firstName, lastName, username, password } = req.body;

    // Validate password length
    if (!password || password.length < 8) {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 8 characters long."
        });
    }

    // Check if the email already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).json({
            success: false,
            message: "Email is already registered."
        });
    }

    // Create new user
    const newUser = new User({ firstName, lastName, username });

    User.register(newUser, password, (err, user) => {
        if (err) {
            console.error("Error in user registration:", err);
            return res.status(500).json({
                success: false,
                message: "An error occurred during registration."
            });
        }

        passport.authenticate("local")(req, res, () => {
            res.status(201).json({
                success: true,
                message: "Your account has been created successfully."
            });
        });
    });
});


// Login route
router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            console.error("Error in authentication:", err);
            return res.status(500).json({
                success: false,
                message: "An error occurred during authentication"
            });
        }
        if (!user) {
            return res.status(401).json({
                success: false,
                message: info.message || "Authentication failed"
            });
        }
        req.login(user, (loginErr) => {
            if (loginErr) {
                console.error("Error in login:", loginErr);
                return res.status(500).json({
                    success: false,
                    message: "An error occurred during login"
                });
            }
            console.log("User logged in successfully:", user);
            return res.json({
                success: true,
                message: "Authentication successful"
            });
        });
    })(req, res, next);
});

// Logout route
router.post("/logout", (req, res) => {
    console.log("Logout route called"); // Debug log
    req.logout((err) => {
        if (err) {
            console.error("Error in logout:", err);
            return res.status(500).json({
                success: false,
                message: "An error occurred during logout: " + err.message
            });
        }
        console.log("User logged out successfully");

        req.session.destroy((sessionErr) => {
            if (sessionErr) {
                console.error("Error destroying session:", sessionErr);
                return res.status(500).json({
                    success: false,
                    message: "Session could not be destroyed"
                });
            }
            // Clear the cookie
            res.clearCookie("connect.sid", { path: '/', domain: 'localhost' });
            console.log("Cookie cleared successfully");
            res.json({
                success: true,
                message: "Logged out successfully"
            });
        });
    });
});

// Route to check if user is authenticated
router.get("/check-auth", (req, res) => {
    console.log("Check Auth Called");
    console.log("Session:", req.session); // Log session data
    console.log("User:", req.user); // Log user data
    if (req.isAuthenticated()) {
        res.json({
            isAuthenticated: true,
            user: {
                id: req.user._id,
                username: req.user.username,
                firstName: req.user.firstName,
                lastName: req.user.lastName
            }
        });
    } else {
        res.json({ isAuthenticated: false });
    }
});

router.get("/current-user", (req, res) => {
    if (req.isAuthenticated()) {
       return res.status(200).json({userId: req.user._id});
    } 
    return res.status(401).json({ message: "Not authorized" });
});

module.exports = router;