let timer = 0;
let time = 0;
Session.setDefault('progress', 0);

Template.dashboard.helpers({
	userPages() {
		if (Meteor.user()) {
			return Meteor.user().profile.pages;
		}

		return []
	},

	selectedPage() {
		if (Meteor.user() && Meteor.user().profile.selectedPage !== null) {
			return Meteor.user().profile.selectedPage;
		}
	},

	getEvents() {
		return false;
	}
});

Template.pageEvents.helpers({
	getProgress() {
		// Mockando progresso
		clearTimeout(timer);
		timer = setTimeout(() => {
			let progress = Session.get('progress');
			if (progress > 100) {
				clearTimeout(timer);

				return;
			}

			Session.set('progress', progress + 2)
		}, 100);

		return Session.get('progress');

		// Criar o metodo abaixo para adicionar os eventos ao usuario
		Meteor.call('getPageEvents', this.page)
	}
});

Template.dashboard.events({
	'click .card': (e, tpl) => {
		let page = Blaze.getData(e.target);
		let userId = Meteor.userId();

		Meteor.users.update(userId, { $set: { 'profile.selectedPage': page } }, () => {
			// CB
		});
	}
});