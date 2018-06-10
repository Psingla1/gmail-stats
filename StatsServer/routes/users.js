var express = require('express');
var router = express.Router();
var verifyAuthenticated = require('../lib/auth').verifyAuthenticated;

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});


router.get('/profile', verifyAuthenticated, function(req, res) {
	res.send('Welcome ' + req.user.displayName);
});

module.exports = router;
