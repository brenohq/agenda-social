Router.route('/api/events/:lat/:lng/:radius', { where: 'server' })
   .get(function () {
	let request = this.request;
	let params = this.params;
	let response = this.response;
	let events = Events.find().fetch();

	response.end(JSON.stringify(events));      
   });