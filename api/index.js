const express = require('express');
const router = express.Router();

const contactsRouter = require('../routes/api/contacts');

router.use('/contacts', contactsRouter);

module.exports = router;
