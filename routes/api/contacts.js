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
	phone: Joi.string()
		.pattern(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/)
		.required(),
});

const updateSchema = Joi.object({
	name: Joi.string(),
	email: Joi.string().email(),
	phone: Joi.string().pattern(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/),
}).or("name", "email", "phone");

const sendResponse = (res, statusCode, message) => {
	res.status(statusCode).json({ message });
};

const contactExists = async (email, phone) => {
	const contacts = await listContacts();
	return contacts.some(
		(contact) => contact.email === email || contact.phone === phone
	);
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
				`Invalid field: ${error.details[0].message}`
			);
		}

		const { email, phone } = req.body;
		const exists = await contactExists(email, phone);
		if (exists) {
			return sendResponse(
				res,
				409,
				"Contact with this email or phone number already exists"
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
			return sendResponse(
				res,
				400,
				`Invalid field: ${error.details[0].message}`
			);
		}

		const { email, phone } = req.body;
		if (email || phone) {
			const exists = await contactExists(email, phone);
			if (exists) {
				return sendResponse(
					res,
					409,
					"Contact with this email or phone number already exists"
				);
			}
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
