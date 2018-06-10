var express = require('express');
var passport = require('passport');

var router = express.Router();

router.get('/login', function(req, res, next) {
	res.send("<a href='/auth/google'>Login with Google</a>");
});

router.get('/logout', function(req, res) {
	req.logOut();
	res.redirect('/auth/login');
});

router.get('/google', passport.authenticate('google', {
	scope: ['profile', 'https://mail.google.com/']
}));

router.get('/google/callback', passport.authenticate('google', {
	successRedirect: '/users/profile',
	failureRedirect: '/auth/login'
}));


module.exports = router;