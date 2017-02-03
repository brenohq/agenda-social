Router.route('/', {
	action() {
		this.render('home');		
	}
});

Router.route('/dashboard', {
	onBeforeAction() {
		if (!Meteor.userId())
			Router.go('/');

		this.next();
	},

	action() {
		if (this.ready())
			this.render('dashboard');
	}
});

Router.route('/cadastre-uma-ONG', {
	action() {
		this.render('cadastro-ong');		
	}
});

Router.route('/ong',{
	action() {
		this.render('ong');
	}
});

Router.route('/about',{
	action() {
		this.render('about');
	}
});