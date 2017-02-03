Template.dashboard.helpers({
	userPages() {
		if (Meteor.user()) {
			console.log(Meteor.user().profile.pages)
			return Meteor.user().profile.pages;;
		}

		return []
	}
});