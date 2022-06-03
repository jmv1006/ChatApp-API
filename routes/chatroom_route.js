const express = require("express");
const router = express.Router();
const chatroomController = require('../controllers/chatroom_controller');

router.get('/', chatroomController.get_all_chatrooms)

router.post('/create', chatroomController.create_chatroom)

router.post('/:chatroomId/create', chatroomController.create_message)

router.get('/:chatroomId/messages', chatroomController.get_messages)

module.exports = router;