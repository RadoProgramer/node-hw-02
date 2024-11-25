const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const contactsRouter = require("./routes/api/contacts");
const authRouter = require("./routes/authRouter");
const passport = require("./config/passport");
require("dotenv").config();
const path = require("path");
const app = express();

app.use((req, res, next) => {
	console.log(`Request received: ${req.method} ${req.url}`);
	next();
});

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.use("/avatars", (req, res, next) => {
	console.log("Request to static file:", req.url);
	next();
});

app.use("/avatars", express.static(path.join(__dirname, "public/avatars")));

app.use("/api/contacts", contactsRouter);
app.use("/api/users", authRouter);

app.use((req, res) => {
	res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
	res.status(500).json({ message: err.message });
});

connectDB();

module.exports = app;
