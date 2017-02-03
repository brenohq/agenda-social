Router.route('/', {
	action() {
		this.render('home');		
	}
});

Router.route('/dashboard', {
	action() {
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