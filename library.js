"use strict";

var winston = module.parent.require('winston'),
    Meta = module.parent.require('./meta'),
    controllers = require('./lib/controllers'),

    plugin = {};

var settings = {};

plugin.init = function(params, callback) {
	var router = params.router,
		hostMiddleware = params.middleware,
		hostControllers = params.controllers;
		
	// We create two routes for every view. One API call, and the actual route itself.
	// Just add the buildHeader middleware to your route and NodeBB will take care of everything for you.

	router.get('/admin/plugins/domainverify', hostMiddleware.admin.buildHeader, controllers.renderAdminPage);
	router.get('/api/admin/plugins/domainverify', controllers.renderAdminPage);

	Meta.settings.get('domainverify', function(err, _settings) {
		if (err) {
			return winston.error(err);
		}
		settings = _settings;
	});

	callback();
};

plugin.addAdminNavigation = function(header, callback) {
	header.plugins.push({
		route: '/plugins/domainverify',
		icon: 'fa-tint',
		name: 'Domain Verification'
	});

	callback(null, header);
};

plugin.verify = function(data, callback) {
	var email = data.userData.email;
	winston.info("Verifying email: " + email);

	var domains = settings['allowed-domains'].split(",");
	var matches = false;

	domains.forEach(function (domain) {
		winston.info("Checking for domain:" + domain);
		if (email.endsWith("@" + domain)) {
			matches = true;
		}
	});

	if (matches) {
		callback(null, data);
	} else {
		return callback(new Error("Invalid Email domain"));
	}
};

module.exports = plugin;
