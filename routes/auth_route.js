const express = require("express");
const router = express.Router();
const auth_controller = require('../controllers/auth_controller')

router.get('/users', auth_controller.get_users)

router.post('/sign-up', auth_controller.create_user)

module.exports = router;