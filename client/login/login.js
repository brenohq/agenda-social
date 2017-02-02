Template.login.events({
	'click #facebook-login': () => {
		Meteor.loginWithFacebook({
			requestPermissions: ['manage_pages'],
			requestOfflineToken: true
		});
	},

	'click #logout': () => {
		Meteor.logout();
	}
});