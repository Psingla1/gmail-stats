module.exports.verifyAuthenticated = function(req, res, next) {
	if (req.user == undefined) {
		res.redirect('/auth/login');
		return;
	}
	next();
};