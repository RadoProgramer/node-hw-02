const fs = require("fs/promises");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const contactsPath = path.join(__dirname, "contacts.json");

const readContacts = async () => {
	const data = await fs.readFile(contactsPath, "utf-8");
	return JSON.parse(data);
};

const writeContacts = async (contacts) => {
	await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
};

const listContacts = async () => {
	return await readContacts();
};

const getContactById = async (contactId) => {
	const contacts = await readContacts();
	return contacts.find((contact) => contact.id === contactId);
};

const removeContact = async (contactId) => {
	const contacts = await readContacts();
	const index = contacts.findIndex((contact) => contact.id === contactId);
	if (index !== -1) {
		const [removedContact] = contacts.splice(index, 1);
		await writeContacts(contacts);
		return removedContact;
	}
	return null;
};

const addContact = async ({ name, email, phone }) => {
	const contacts = await readContacts();
	const newContact = { id: uuidv4(), name, email, phone };
	contacts.push(newContact);
	await writeContacts(contacts);
	return newContact;
};

const updateContact = async (contactId, body) => {
	const contacts = await readContacts();
	const index = contacts.findIndex((contact) => contact.id === contactId);
	if (index !== -1) {
		contacts[index] = { ...contacts[index], ...body };
		await writeContacts(contacts);
		return contacts[index];
	}
	return null;
};

module.exports = {
	listContacts,
	getContactById,
	removeContact,
	addContact,
	updateContact,
};
