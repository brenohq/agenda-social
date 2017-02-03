Template.dashboard.helpers({
	userPages() {
		if (Meteor.user()) {
			return Meteor.user().profile.pages;
		}

		return []
	}
});