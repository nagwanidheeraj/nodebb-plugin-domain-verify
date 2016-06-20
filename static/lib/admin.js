'use strict';
/* globals $, app, socket */

define('admin/plugins/domainverify', ['settings'], function(Settings) {

	var ACP = {};

	ACP.init = function() {
		Settings.load('domainverify', $('.domainverify-settings'));

		$('#save').on('click', function() {
			Settings.save('domainverify', $('.domainverify-settings'), function() {
				app.alert({
					type: 'success',
					alert_id: 'domainverify-saved',
					title: 'Settings Saved',
					message: 'Please reload your NodeBB to apply these settings',
					clickfn: function() {
						socket.emit('admin.reload');
					}
				});
			});
		});
	};

	return ACP;
});
