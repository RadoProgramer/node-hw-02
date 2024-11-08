const Contact = require("../../models/Contact");

const listContacts = async () => Contact.find();
const getContactById = async (contactId) => Contact.findById(contactId);
const removeContact = async (contactId) => Contact.findByIdAndDelete(contactId);
const addContact = async ({ name, email, phone }) => {
	const newContact = new Contact({ name, email, phone });
	return await newContact.save();
};
const updateContact = async (contactId, body) =>
	Contact.findByIdAndUpdate(contactId, body, { new: true });
const updateStatusContact = async (contactId, { favorite }) =>
	Contact.findByIdAndUpdate(contactId, { favorite }, { new: true });

module.exports = {
	listContacts,
	getContactById,
	removeContact,
	addContact,
	updateContact,
	updateStatusContact,
};
