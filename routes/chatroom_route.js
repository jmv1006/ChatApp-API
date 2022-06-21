const express = require("express");
const router = express.Router();
const chatroomController = require('../controllers/chatroom_controller');

router.get('/all', chatroomController.get_all_chatrooms)

router.get('/users/:userId', chatroomController.get_user_chatrooms)

router.post('/create', chatroomController.create_chatroom)

router.get('/:chatroomId', chatroomController.get_specific_chatroom)

router.post('/:chatroomId', chatroomController.create_message)

router.get('/:chatroomId/messages/:pageNumber', chatroomController.get_paginated_messages);

module.exports = router;