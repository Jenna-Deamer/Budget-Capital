const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Store hashed passwords
});

// Hash password before saving the user
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next(); // Skip if the password is not modified
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method to compare passwords during login
UserSchema.methods.comparePassword = function (candidatePassword) {
    console.log("Stored password:", this.password);
    console.log("Password to compare:", candidatePassword);
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
