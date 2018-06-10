var express = require('express');
var router = express.Router();
var verifyAuthenticated = require('../lib/auth').verifyAuthenticated;

var googleapis = require('googleapis');

router.get('/list', verifyAuthenticated, function(req, res) {
	console.log('Using refresh token: ' + req.user.googleRefreshToken);
	var refreshToken = req.user.googleRefreshToken;
	var oauthClient = new googleapis.google.auth.OAuth2(
		process.env.GOOGLE_CLIENT_ID,
		process.env.GOOGLE_CLIENT_SECRET,
		'http://localhost:3000/auth/google/callback'
	);
	oauthClient.setCredentials({
		refresh_token: refreshToken
	});
	
	const gmail = googleapis.google.gmail({
		version: 'v1',
		auth: oauthClient
	});
	
	gmail.users.threads.list({
		userId: 'me',
	}).then(function(gmailRes) {
		//res.send(JSON.stringify(gmailRes.data, null, 2));
		res.render('gmail/list', { threads : gmailRes.data.threads});
	}).catch(function(err) {
		res.send(err.toString());
	});
});



module.exports = router;
