require('dotenv').config();
const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { generateToken, verifyToken } = require("../utils/jwt");
const bcrypt = require('bcrypt');

// Moved this out of app.js since it's an auth thing
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
},
    async function (token, tokenSecret, profile, done) {
        try {
            let user = await User.findOne({ username: profile.emails[0].value });

            if (!user) {
                user = new User({
                    firstName: profile.name.givenName || 'N/A',
                    lastName: profile.name.familyName || 'N/A',
                    username: profile.emails[0].value
                });
                await user.save();
            }

            return done(null, user);
        } catch (err) {
            return done(err, null);
        }
    }
));

router.post("/signup", async (req, res) => {
    const { firstName, lastName, username, password } = req.body;

    // Validate password length
    if (!password || password.length < 8) {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 8 characters long."
        });
    }

    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).json({
            success: false,
            message: "Username is already registered."
        });
    }

    // Create new user
    const newUser = new User({ firstName, lastName, username, password });

    try {
        await newUser.save(); // Save the user, the password will be hashed by pre-save middleware

        // Generate JWT token
        const token = generateToken(newUser);
        return res.status(201).json({
            success: true,
            message: "Account created successfully",
            token
        });
    } catch (err) {
        console.error("Error during registration:", err);
        res.status(500).json({ message: "An error occurred during registration" });
    }
});

// Login route
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = generateToken(user);
        res.json({ 
            success: true, 
            token,
            user: {
                id: user._id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Logout route
router.post("/logout", (req, res) => {
    // Clear any stored token in client storage (handled in frontend)
    res.json({
        success: true,
        message: "Logged out successfully"
    });
});

// Google Sign-in
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    const token = generateToken(req.user); // Generate JWT after successful authentication
    res.json({ success: true, token }); // Send JWT token to client
});

// Route to check if user is authenticated
router.get("/check-auth", (req, res) => {
    console.log("Headers:", req.headers); // Debug headers
    const token = req.headers.authorization?.split(" ")[1];
    
    console.log("Received token:", token); // Debug token

    if (!token) {
        console.log("No token found"); // Debug missing token
        return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    try {
        const user = verifyToken(token);
        console.log("Verified user:", user); // Debug decoded user
        res.json({
            isAuthenticated: true,
            user: {
                id: user.userId,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName
            }
        });
    } catch (err) {
        console.log("Token verification error:", err); // Debug verification error
        res.status(403).json({ success: false, message: "Invalid or expired token" });
    }
});

// Protect route with JWT middleware
router.get("/protected", (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from the header

    if (!token) {
        return res.status(401).json({ message: "Unauthorized access" });
    }

    try {
        const user = verifyToken(token); // Verify the token
        res.json({ message: "This is protected data", user });
    } catch (err) {
        res.status(403).json({ message: "Invalid or expired token" });
    }
});

module.exports = router;
