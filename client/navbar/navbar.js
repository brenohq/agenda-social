Template.navbar.helpers({
	isActive(route) {
		if (Router.current())
			if (Router.current().route.path() === route)
				return 'is-active';

		return '';
	}
});

Template.navbar.events({
	'click #nav-toggle': () => {
		var $menu = $('#nav-menu');
		$(this).toggleClass('is-active');
		$menu.toggleClass('is-active');
	},

	'click .logout': () => {
		Meteor.logout();
		Router.go('/');
	}
});