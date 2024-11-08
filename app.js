const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const contactsRouter = require('./routes/api/contacts');
require('dotenv').config();

const app = express();

const startServer = async () => {
    try {
        await mongoose.connect(process.env.DB_HOST);
        console.log("Database connection successful");

        app.use(cors());
        app.use(express.json());
        app.use('/api/contacts', contactsRouter);

        app.use((req, res) => {
            res.status(404).json({ message: 'Not found' });
        });

        app.use((err, req, res, next) => {
            res.status(500).json({ message: err.message });
        });

        app.listen(3000, () => {
            console.log("Server running. Use our API on port: 3000");
        });
    } catch (error) {
        console.error("Database connection error:", error.message);
        process.exit(1);
    }
};

startServer();
