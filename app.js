const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const passport = require("passport");
const setJWTStrategy = require("./config/jwt");
const contactsRouter = require("./routes/api/contacts");
const usersRouter = require("./routes/api/users");
require("dotenv").config();

const app = express();
connectDB();
setJWTStrategy();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.use(
	"/api/contacts",
	passport.authenticate("jwt", { session: false }),
	contactsRouter
);
app.use("/api/users", usersRouter);

app.use((req, res) => {
	res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
	res.status(500).json({ message: err.message });
});

module.exports = app;
