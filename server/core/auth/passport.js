"use strict";

let logger 			= require("../logger");
let config 			= require("../../config");

let passport 		= require("passport");
let path 			= require("path");
let chalk 			= require("chalk");

if (!WEBPACK_BUNDLE) require('require-webpack-compat')(module, require);

let User 			= require("../../models/user");

module.exports = function(app) {

	// Use passport session
	app.use(passport.initialize());
	app.use(passport.session());	

	passport.serializeUser(function(user, done) {
		return done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		User.findOne({
			_id: id
		}, "-password", function(err, user) {
			return done(err, user);
		});
	});

	logger.info("");
	logger.info(chalk.bold("Search passport strategies..."));

	function requireAll(r) { 
		return r.keys().map(function(module) {
			logger.info("  Loading passport strategy file " + path.basename(module) + "...");
			let strategy = r(module);
			strategy();

			return strategy;
		})
	}
	var modules = requireAll(require.context("./strategies", true, /\.js$/));
};
