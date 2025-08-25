const mongoose = require("mongoose");

const DB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB);
        console.log("MongoDB Connected...");
    } catch (err) {
        console.error("MongoDB Connection Failed:", err.message);
    }
};

module.exports = DB;
