const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const passport = require('passport')
const auth = require('../controllers/auth')

router.route('/register')
    .get(auth.userRegistrationForm)
    .post(catchAsync(auth.newUser))

router.route('/login')
    .get(auth.loginForm)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
        auth.login)

router.get('/logout', auth.logout)


module.exports = router;