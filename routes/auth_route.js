const express = require("express");
const router = express.Router();
const auth_controller = require('../controllers/auth_controller')
const passport = require("passport");

router.get('/users',  passport.authenticate("jwt", { session: false }), auth_controller.get_users)

router.get('/users/:userId',  passport.authenticate("jwt", { session: false }), auth_controller.get_specific_user)

router.post('/sign-up', auth_controller.create_user)

router.post('/sign-in', auth_controller.sign_in)

module.exports = router;