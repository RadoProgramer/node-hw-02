const Contact = require("../../models/contact");

const fetchContacts = async () => {
	return await Contact.find();
};

const fetchContactById = async (contactId) => {
	return await Contact.findById(contactId);
};

const insertContact = async ({ name, email, phone }) => {
	const newContact = new Contact({ name, email, phone });
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
