const mongoose = require("mongoose");
const {
	listContacts,
	getContactById,
	removeContact,
	addContact,
	updateContact: updateContactService,
	updateStatusContact,
} = require("./services");

const sendResponse = (res, status, message, data = null) => {
	const response = { message };
	if (data) response.data = data;
	res.status(status).json(response);
};

const getAllContacts = async (req, res, next) => {
	try {
		const contacts = await listContacts();
		sendResponse(res, 200, "Contacts retrieved successfully", contacts);
	} catch (error) {
		next(error);
	}
};

const getContact = async (req, res, next) => {
	const { contactId } = req.params;
	if (!mongoose.Types.ObjectId.isValid(contactId)) {
		return sendResponse(res, 400, "Invalid contact ID format");
	}

	try {
		const contact = await getContactById(contactId);
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
		const newContact = await addContact(req.body);
		sendResponse(res, 201, "Contact created successfully", newContact);
	} catch (error) {
		if (error.code === 11000) {
			sendResponse(res, 409, "Contact with this email or phone already exists");
		} else {
			next(error);
		}
	}
};

const updateContact = async (req, res, next) => {
	const { contactId } = req.params;
	if (!mongoose.Types.ObjectId.isValid(contactId)) {
		return sendResponse(res, 400, "Invalid contact ID format");
	}

	try {
		const updatedContact = await updateContactService(contactId, req.body);
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

const deleteContact = async (req, res, next) => {
	const { contactId } = req.params;
	if (!mongoose.Types.ObjectId.isValid(contactId)) {
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

const updateFavorite = async (req, res, next) => {
	const { contactId } = req.params;
	if (!mongoose.Types.ObjectId.isValid(contactId)) {
		return sendResponse(res, 400, "Invalid contact ID format");
	}

	if (typeof req.body.favorite !== "boolean") {
		return sendResponse(res, 400, "Missing field favorite");
	}

	try {
		const updatedContact = await updateStatusContact(contactId, req.body);
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
	getContact,
	createContact,
	updateContact,
	deleteContact,
	updateFavorite,
};
