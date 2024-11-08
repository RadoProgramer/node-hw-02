// const express = require("express");
// const Joi = require("joi");
// const {
//     listContacts,
//     getContactById,
//     removeContact,
//     addContact,
//     updateContact,
//     updateStatusContact,
// } = require("../../models/contacts");

// const router = express.Router();

// const contactSchema = Joi.object({
//     name: Joi.string().required(),
//     email: Joi.string().email().required(),
//     phone: Joi.string().required(),
// });

// const updateSchema = Joi.object({
//     name: Joi.string(),
//     email: Joi.string().email(),
//     phone: Joi.string(),
// }).or("name", "email", "phone");

// const favoriteSchema = Joi.object({
//     favorite: Joi.boolean().required(),
// });

// router.get("/", async (req, res, next) => {
//     try {
//         const contacts = await listContacts();
//         res.status(200).json(contacts);
//     } catch (error) {
//         next(error);
//     }
// });

// router.get("/:contactId", async (req, res, next) => {
//     try {
//         const contact = await getContactById(req.params.contactId);
//         if (contact) {
//             res.status(200).json(contact);
//         } else {
//             res.status(404).json({ message: "Not found" });
//         }
//     } catch (error) {
//         next(error);
//     }
// });

// router.post("/", async (req, res, next) => {
//     try {
//         const { error } = contactSchema.validate(req.body);
//         if (error) {
//             return res.status(400).json({
//                 message: `missing required ${error.details[0].path[0]} - field`,
//             });
//         }

//         const newContact = await addContact(req.body);
//         res.status(201).json(newContact);
//     } catch (error) {
//         next(error);
//     }
// });

// router.delete("/:contactId", async (req, res, next) => {
//     try {
//         const contact = await removeContact(req.params.contactId);
//         if (contact) {
//             res.status(200).json({ message: "contact deleted" });
//         } else {
//             res.status(404).json({ message: "Not found" });
//         }
//     } catch (error) {
//         next(error);
//     }
// });

// router.put("/:contactId", async (req, res, next) => {
//     try {
//         const { error } = updateSchema.validate(req.body);
//         if (error) return res.status(400).json({ message: "missing fields" });

//         const updatedContact = await updateContact(req.params.contactId, req.body);
//         if (updatedContact) {
//             res.status(200).json(updatedContact);
//         } else {
//             res.status(404).json({ message: "Not found" });
//         }
//     } catch (error) {
//         next(error);
//     }
// });

// router.patch("/:contactId/favorite", async (req, res, next) => {
//     try {
//         const { error } = favoriteSchema.validate(req.body);
//         if (error) {
//             return res.status(400).json({ message: "missing field favorite" });
//         }

//         const updatedContact = await updateStatusContact(req.params.contactId, req.body);
//         if (updatedContact) {
//             res.status(200).json(updatedContact);
//         } else {
//             res.status(404).json({ message: "Not found" });
//         }
//     } catch (error) {
//         next(error);
//     }
// });

// module.exports = router;











// const express = require("express");
// const Joi = require("joi");
// const {
//     listContacts,
//     getContactById,
//     removeContact,
//     addContact,
//     updateContact,
//     updateStatusContact,
// } = require("../../models/contacts");

// const router = express.Router();

// const favoriteSchema = Joi.object({
//     favorite: Joi.boolean().required(),
// });

// router.get("/", async (req, res, next) => {
//     try {
//         const contacts = await listContacts();
//         res.status(200).json(contacts);
//     } catch (error) {
//         next(error);
//     }
// });

// router.get("/:contactId", async (req, res, next) => {
//     try {
//         const contact = await getContactById(req.params.contactId);
//         if (contact) {
//             res.status(200).json(contact);
//         } else {
//             res.status(404).json({ message: "Not found" });
//         }
//     } catch (error) {
//         next(error);
//     }
// });

// router.post("/", async (req, res, next) => {
//     try {
//         const newContact = await addContact(req.body);
//         res.status(201).json(newContact);
//     } catch (error) {
//         if (error.code === 11000) {
//             res.status(409).json({ message: "Contact with this email or phone already exists" });
//         } else {
//             next(error);
//         }
//     }
// });

// router.delete("/:contactId", async (req, res, next) => {
//     try {
//         const contact = await removeContact(req.params.contactId);
//         if (contact) {
//             res.status(200).json({ message: "contact deleted" });
//         } else {
//             res.status(404).json({ message: "Not found" });
//         }
//     } catch (error) {
//         next(error);
//     }
// });

// router.put("/:contactId", async (req, res, next) => {
//     try {
//         const updatedContact = await updateContact(req.params.contactId, req.body);
//         if (updatedContact) {
//             res.status(200).json(updatedContact);
//         } else {
//             res.status(404).json({ message: "Not found" });
//         }
//     } catch (error) {
//         if (error.code === 11000) {
//             res.status(409).json({ message: "Contact with this email or phone already exists" });
//         } else {
//             next(error);
//         }
//     }
// });

// router.patch("/:contactId/favorite", async (req, res, next) => {
//     try {
//         const { error } = favoriteSchema.validate(req.body);
//         if (error) {
//             return res.status(400).json({ message: "missing field favorite" });
//         }

//         const updatedContact = await updateStatusContact(req.params.contactId, req.body);
//         if (updatedContact) {
//             res.status(200).json(updatedContact);
//         } else {
//             res.status(404).json({ message: "Not found" });
//         }
//     } catch (error) {
//         next(error);
//     }
// });

// module.exports = router;







// const express = require("express");
// const Joi = require("joi");
// const mongoose = require("mongoose");
// const {
//     listContacts,
//     getContactById,
//     removeContact,
//     addContact,
//     updateContact,
//     updateStatusContact,
// } = require("../../models/contacts");

// const router = express.Router();


// const favoriteSchema = Joi.object({
//     favorite: Joi.boolean().required(),
// });


// const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// router.get("/", async (req, res, next) => {
//     try {
//         const contacts = await listContacts();
//         res.status(200).json(contacts);
//     } catch (error) {
//         next(error);
//     }
// });

// router.get("/:contactId", async (req, res, next) => {
//     const { contactId } = req.params;

//     if (!isValidObjectId(contactId)) {
//         return res.status(400).json({ message: "Invalid contact ID format" });
//     }

//     try {
//         const contact = await getContactById(contactId);
//         if (contact) {
//             res.status(200).json(contact);
//         } else {
//             res.status(404).json({ message: "Not found" });
//         }
//     } catch (error) {
//         next(error);
//     }
// });

// router.post("/", async (req, res, next) => {
//     try {
//         const newContact = await addContact(req.body);
//         res.status(201).json(newContact);
//     } catch (error) {
//         if (error.code === 11000) {
//             res.status(409).json({ message: "Contact with this email or phone already exists" });
//         } else {
//             next(error);
//         }
//     }
// });

// router.delete("/:contactId", async (req, res, next) => {
//     const { contactId } = req.params;

//     if (!isValidObjectId(contactId)) {
//         return res.status(400).json({ message: "Invalid contact ID format" });
//     }

//     try {
//         const contact = await removeContact(contactId);
//         if (contact) {
//             res.status(200).json({ message: "Contact deleted" });
//         } else {
//             res.status(404).json({ message: "Not found" });
//         }
//     } catch (error) {
//         next(error);
//     }
// });

// router.put("/:contactId", async (req, res, next) => {
//     const { contactId } = req.params;

//     if (!isValidObjectId(contactId)) {
//         return res.status(400).json({ message: "Invalid contact ID format" });
//     }

//     try {
//         const updatedContact = await updateContact(contactId, req.body);
//         if (updatedContact) {
//             res.status(200).json(updatedContact);
//         } else {
//             res.status(404).json({ message: "Not found" });
//         }
//     } catch (error) {
//         if (error.code === 11000) {
//             res.status(409).json({ message: "Contact with this email or phone already exists" });
//         } else {
//             next(error);
//         }
//     }
// });

// router.patch("/:contactId/favorite", async (req, res, next) => {
//     const { contactId } = req.params;

//     if (!isValidObjectId(contactId)) {
//         return res.status(400).json({ message: "Invalid contact ID format" });
//     }

//     const { error } = favoriteSchema.validate(req.body);
//     if (error) {
//         return res.status(400).json({ message: "missing field favorite" });
//     }

//     try {
//         const updatedContact = await updateStatusContact(contactId, req.body);
//         if (updatedContact) {
//             res.status(200).json(updatedContact);
//         } else {
//             res.status(404).json({ message: "Not found" });
//         }
//     } catch (error) {
//         next(error);
//     }
// });

// module.exports = router;









const express = require("express");
const Joi = require("joi");
const mongoose = require("mongoose");
const {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact,
    updateStatusContact,
} = require("../../models/contacts");

const router = express.Router();

// Schemat walidacji dla pola favorite
const favoriteSchema = Joi.object({
    favorite: Joi.boolean().required(),
});

// Funkcja pomocnicza do sprawdzania poprawności ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Funkcja pomocnicza do wysyłania odpowiedzi
const sendResponse = (res, status, message, data = null) => {
    const response = { message };
    if (data) response.data = data;
    res.status(status).json(response);
};

router.get("/", async (req, res, next) => {
    try {
        const contacts = await listContacts();
        sendResponse(res, 200, "Contacts retrieved successfully", contacts);
    } catch (error) {
        next(error);
    }
});

router.get("/:contactId", async (req, res, next) => {
    const { contactId } = req.params;

    if (!isValidObjectId(contactId)) {
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
});

router.post("/", async (req, res, next) => {
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
});

router.delete("/:contactId", async (req, res, next) => {
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
});

router.put("/:contactId", async (req, res, next) => {
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
});

router.patch("/:contactId/favorite", async (req, res, next) => {
    const { contactId } = req.params;

    if (!isValidObjectId(contactId)) {
        return sendResponse(res, 400, "Invalid contact ID format");
    }

    const { error } = favoriteSchema.validate(req.body);
    if (error) {
        return sendResponse(res, 400, "Missing field favorite");
    }

    try {
        const updatedContact = await updateStatusContact(contactId, req.body);
        if (updatedContact) {
            sendResponse(res, 200, "Contact status updated successfully", updatedContact);
        } else {
            sendResponse(res, 404, "Not found");
        }
    } catch (error) {
        next(error);
    }
});

module.exports = router;
