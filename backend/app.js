const cors = require("cors");
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const port = 3000;
const indexRouter = require("./routes/auth");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var session = require("express-session");
const User = require("./models/user");

// Use dotenv in non-production environments
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();

    // CORS in dev mode to accept requests from localhost:4200
    app.use(
        cors({
            origin: "*", // Adjust CORS settings as needed
            methods: "GET,POST,PUT,DELETE,HEAD,OPTIONS",
        })
    );
}

app.use(
    session({
        secret: process.env.SECRET_KEY,
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false },
    })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport to use Local Strategy
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Use JSON middleware and URL-encoded parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uri = process.env.CONNECTION_STRING;
const clientOptions = {
    serverApi: { version: "1", strict: true, deprecationErrors: true },
};

// MongoDB connection
async function run() {
    try {
        await mongoose.connect(uri, clientOptions);
        await mongoose.connection.db.admin().command({ ping: 1 });
        console.log("mongodb connection successful");
    } catch (e) {
        console.error(e);
    }
}
run().catch(console.dir);

app.use("/", indexRouter);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
