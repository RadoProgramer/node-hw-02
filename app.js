const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const contactsRouter = require("./routes/api/contacts");
const authRouter = require("./routes/authRouter");
const passport = require("./config/passport");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

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
