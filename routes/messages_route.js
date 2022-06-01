const express = require("express");
const router = express.Router();
const messagesController = require('../controllers/messages_controller');

router.get('/', messagesController.get_all_messages)

router.post('/', messagesController.create_message)

module.exports = router;