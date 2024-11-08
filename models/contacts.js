const Contact = require('./contact');

const listContacts = async () => {
    return await Contact.find();
};

const getContactById = async (contactId) => {
    return await Contact.findById(contactId);
};

const removeContact = async (contactId) => {
    return await Contact.findByIdAndDelete(contactId);
};

const addContact = async ({ name, email, phone }) => {
    const newContact = new Contact({ name, email, phone });
    return await newContact.save();
};

const updateContact = async (contactId, body) => {
    return await Contact.findByIdAndUpdate(contactId, body, { new: true });
};

const updateStatusContact = async (contactId, { favorite }) => {
    return await Contact.findByIdAndUpdate(contactId, { favorite }, { new: true });
};

module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact,
    updateStatusContact,
};
