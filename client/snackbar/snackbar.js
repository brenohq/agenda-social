Session.setDefault('error', '');

Template.snackbar.helpers({
	snackbarText() {
		if (Session.get('error')) {
			setTimeout(() => {
				Session.set('error', '');
			}, 3000);
		}

		return Session.get('error');
	}
});