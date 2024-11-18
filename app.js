const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const contactsRouter = require("./routes/api/contacts");
require("dotenv").config()
const usersRouter = require("./routes/api/users");;

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/contacts", contactsRouter);

app.use((req, res) => {
	res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
	res.status(500).json({ message: err.message });
});

connectDB();
app.use("/api/users", usersRouter);

module.exports = app;
