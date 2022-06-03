const express = require("express");
const router = express.Router();
const chatroomController = require('../controllers/chatroom_controller');
const passport = require('passport');

router.get('/all', chatroomController.get_all_chatrooms)

router.get('/:chatroomId', chatroomController.get_specific_chatroom)

router.post('/create', chatroomController.create_chatroom)

router.post('/:chatroomId/create-message', chatroomController.create_message)

router.get('/:chatroomId/messages', chatroomController.get_messages)

module.exports = router;