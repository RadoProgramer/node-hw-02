const {
	fetchContacts,
	fetchContactById,
	insertContact,
	removeContact,
	updateContact,
	updateStatus,
} = require("./services");
const Joi = require("joi");
const mongoose = require("mongoose");

const favoriteSchema = Joi.object({
	favorite: Joi.boolean().required(),
});

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const sendResponse = (res, status, message, data = null) => {
	const response = { message };
	if (data) response.data = data;
	res.status(status).json(response);
};

const getAllContacts = async (req, res, next) => {
	try {
		const contacts = await fetchContacts();
		sendResponse(res, 200, "Contacts retrieved successfully", contacts);
	} catch (error) {
		next(error);
	}
};

const getContactById = async (req, res, next) => {
	const { contactId } = req.params;

	if (!isValidObjectId(contactId)) {
		return sendResponse(res, 400, "Invalid contact ID format");
	}

	try {
		const contact = await fetchContactById(contactId);
		if (contact) {
			sendResponse(res, 200, "Contact retrieved successfully", contact);
		} else {
			sendResponse(res, 404, "Not found");
		}
	} catch (error) {
		next(error);
	}
};

const createContact = async (req, res, next) => {
	try {
		const newContact = await insertContact(req.body);
		sendResponse(res, 201, "Contact created successfully", newContact);
	} catch (error) {
		if (error.code === 11000) {
			sendResponse(res, 409, "Contact with this email or phone already exists");
		} else {
			next(error);
		}
	}
};

const deleteContact = async (req, res, next) => {
	const { contactId } = req.params;

	if (!isValidObjectId(contactId)) {
		return sendResponse(res, 400, "Invalid contact ID format");
	}

	try {
		const contact = await removeContact(contactId);
		if (contact) {
			sendResponse(res, 200, "Contact deleted");
		} else {
			sendResponse(res, 404, "Not found");
		}
	} catch (error) {
		next(error);
	}
};

const updateContactById = async (req, res, next) => {
	const { contactId } = req.params;

	if (!isValidObjectId(contactId)) {
		return sendResponse(res, 400, "Invalid contact ID format");
	}

	try {
		const updatedContact = await updateContact(contactId, req.body);
		if (updatedContact) {
			sendResponse(res, 200, "Contact updated successfully", updatedContact);
		} else {
			sendResponse(res, 404, "Not found");
		}
	} catch (error) {
		if (error.code === 11000) {
			sendResponse(res, 409, "Contact with this email or phone already exists");
		} else {
			next(error);
		}
	}
};

const updateContactStatus = async (req, res, next) => {
	const { contactId } = req.params;

	if (!isValidObjectId(contactId)) {
		return sendResponse(res, 400, "Invalid contact ID format");
	}

	const { error } = favoriteSchema.validate(req.body);
	if (error) {
		return sendResponse(res, 400, "Missing field favorite");
	}

	try {
		const updatedContact = await updateStatus(contactId, req.body);
		if (updatedContact) {
			sendResponse(
				res,
				200,
				"Contact status updated successfully",
				updatedContact
			);
		} else {
			sendResponse(res, 404, "Not found");
		}
	} catch (error) {
		next(error);
	}
};

module.exports = {
	getAllContacts,
	getContactById,
	createContact,
	deleteContact,
	updateContactById,
	updateContactStatus,
};