const express = require("express");
const Joi = require("joi");
const {
	listContacts,
	getContactById,
	removeContact,
	addContact,
	updateContact,
} = require("../../models/contacts");

const router = express.Router();

const contactSchema = Joi.object({
	name: Joi.string().required(),
	email: Joi.string().email().required(),
	phone: Joi.string().required(),
});

const updateSchema = Joi.object({
	name: Joi.string(),
	email: Joi.string().email(),
	phone: Joi.string(),
}).or("name", "email", "phone");

const sendResponse = (res, statusCode, message) => {
	res.status(statusCode).json({ message });
};

router.get("/", async (req, res, next) => {
	try {
		const contacts = await listContacts();
		res.status(200).json(contacts);
	} catch (error) {
		next(error);
	}
});

router.get("/:contactId", async (req, res, next) => {
	try {
		const contact = await getContactById(req.params.contactId);
		if (contact) {
			res.status(200).json(contact);
		} else {
			sendResponse(res, 404, "Not found");
		}
	} catch (error) {
		next(error);
	}
});

router.post("/", async (req, res, next) => {
	try {
		const { error } = contactSchema.validate(req.body);
		if (error) {
			return sendResponse(
				res,
				400,
				`Missing required ${error.details[0].path[0]} - field`
			);
		}

		const newContact = await addContact(req.body);
		res.status(201).json(newContact);
	} catch (error) {
		next(error);
	}
});

router.delete("/:contactId", async (req, res, next) => {
	try {
		const contact = await removeContact(req.params.contactId);
		if (contact) {
			sendResponse(res, 200, "Contact deleted");
		} else {
			sendResponse(res, 404, "Not found");
		}
	} catch (error) {
		next(error);
	}
});

router.put("/:contactId", async (req, res, next) => {
	try {
		const { error } = updateSchema.validate(req.body);
		if (error) {
			return sendResponse(res, 400, "Missing fields");
		}

		const updatedContact = await updateContact(req.params.contactId, req.body);
		if (updatedContact) {
			res.status(200).json(updatedContact);
		} else {
			sendResponse(res, 404, "Not found");
		}
	} catch (error) {
		next(error);
	}
});

module.exports = router;
