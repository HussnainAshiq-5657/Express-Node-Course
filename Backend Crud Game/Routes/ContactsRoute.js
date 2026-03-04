const express = require('express');
const {
  getAllContact,
  AddContact,
  ShowContact,
  UpdateContact,
  deleteContact,
  UpdateContacts,
  AddContactPage,
} = require('../Controller/ContactController.js');
const router = express.Router();

router.get('/', getAllContact);
router.get('/add-contact', AddContactPage);
router.post('/add-contact', AddContact);
router.get('/show-contact/:id', ShowContact);
router.get('/update-contact/:id', UpdateContact);
router.post('/update-contact/:id', UpdateContacts);
router.get('/delete-contact/:id', deleteContact);

module.exports = router;
