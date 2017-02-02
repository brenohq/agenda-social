Router.route('/', {
	action() {
		this.render('home');		
	}
});

Router.route('/cadastre-uma-ONG', {
	action() {
		this.render('cadastro-ong');		
	}
});