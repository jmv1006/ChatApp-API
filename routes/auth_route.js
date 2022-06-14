const express = require("express");
const router = express.Router();
const auth_controller = require('../controllers/auth_controller')
const passport = require("passport");

router.get('/users',  passport.authenticate("jwt", { session: false }), auth_controller.get_users)

router.get('/users/:userId',  passport.authenticate("jwt", { session: false }), auth_controller.get_specific_user)

router.post('/sign-up', auth_controller.create_user)

router.post('/sign-in', auth_controller.sign_in)

router.get('/log-out', auth_controller.log_out)

router.get('/session', auth_controller.check_if_session_valid)

router.get('/', (req, res) => {
    res.status(200)
})

module.exports = router;