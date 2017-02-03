Template.home.onRendered(() => {
	if (Meteor.userId()) {
		Router.go('/dashboard');
	}
});