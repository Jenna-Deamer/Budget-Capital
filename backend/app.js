const cors = require("cors");
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const port = 3000;
const indexRouter = require("./routes/index");

// passport
var passport = require("passport");
var LocalStrategy = require("passport-local");

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();

    // CORS in dev mode to accept requests from localhost:4200
    // not needed in prod as angular app runs on same domain
    const cors = require("cors");
    app.use(
        cors({
            // origin: process.env.CLIENT_URL,
            origin: "*",
            methods: "GET,POST,PUT,DELETE,HEAD,OPTIONS",
        })
    );
}

const uri = process.env.CONNECTION_STRING;
const clientOptions = {
    serverApi: { version: "1", strict: true, deprecationErrors: true },
};
async function run() {
    try {
        // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
        await mongoose.connect(uri, clientOptions);
        await mongoose.connection.db.admin().command({ ping: 1 });
        console.log(
            "Pinged your deployment. You successfully connected to MongoDB!"
        );
    } finally {
        // Ensures that the client will close when you finish/error
        await mongoose.disconnect();
    }
}
run().catch(console.dir);

app.use("/", indexRouter);
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});

app.get("");
