const express = require("express");
const {
	getAllContacts,
	getContact,
	createContact,
	updateContact,
	deleteContact,
	updateFavorite,
} = require("../../controllers/contacts");

const router = express.Router();

router.get("/", getAllContacts);
router.get("/:contactId", getContact);
router.post("/", createContact);
router.put("/:contactId", updateContact);
router.delete("/:contactId", deleteContact);
router.patch("/:contactId/favorite", updateFavorite);

module.exports = router;
