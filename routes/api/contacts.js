const express = require("express");
const authMiddleware = require("../../middleware/authMiddleware");
const {
	getAllContacts,
	getContactById,
	createContact,
	deleteContact,
	updateContactById,
	updateContactStatus,
} = require("../../controllers/contacts");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getAllContacts);
router.get("/:contactId", getContactById);
router.post("/", createContact);
router.delete("/:contactId", deleteContact);
router.put("/:contactId", updateContactById);
router.patch("/:contactId/favorite", updateContactStatus);

module.exports = router;
