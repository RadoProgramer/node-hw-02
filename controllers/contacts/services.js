const Contact = require("../../models/contact");

const fetchContacts = async (filter, skip = 0, limit = 20) => {
	return await Contact.find(filter)
		.skip(Number(skip))
		.limit(Number(limit))
		.populate("owner", "email");
};

const fetchContactById = async (contactId) => {
	return await Contact.findById(contactId).populate("owner", "email");
};

const insertContact = async ({ name, email, phone, owner }) => {
	const newContact = new Contact({ name, email, phone, owner });
	return await newContact.save();
};

const removeContact = async (contactId) => {
	return await Contact.findByIdAndDelete(contactId);
};

const updateContact = async (contactId, body) => {
	return await Contact.findByIdAndUpdate(contactId, body, { new: true });
};

const updateStatus = async (contactId, { favorite }) => {
	return await Contact.findByIdAndUpdate(
		contactId,
		{ favorite },
		{ new: true }
	);
};

module.exports = {
	fetchContacts,
	fetchContactById,
	insertContact,
	removeContact,
	updateContact,
	updateStatus,
};
