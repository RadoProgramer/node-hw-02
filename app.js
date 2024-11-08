const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const apiRouter = require("./api");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);

app.use((req, res) => {
	res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
	res.status(500).json({ message: err.message });
});

const startServer = async () => {
	try {
		await mongoose.connect(process.env.DB_HOST);
		console.log("Database connection successful");
	} catch (error) {
		console.error("Database connection error:", error.message);
		process.exit(1);
	}
};

startServer();

module.exports = app;
