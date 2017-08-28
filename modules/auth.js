var passport = require('passport'),
	localStrategy = require('passport-local').Strategy,
	authController = require('../controllers/authController');

passport.use(new localStrategy (
	{
		usernameField: 'login', 
   		passwordField: 'password' 
	},
	authController.authLocal
));

passport.serializeUser(authController.serialize);

passport.deserializeUser(authController.deserialize);

module.exports = passport;