Router.route('/api/events/:lat/:lng/:limit/:radius', { where: 'server' })
	.get(function () {
		let request = this.request;
		let params = this.params;
		let response = this.response;
		let events = Events.find().fetch();
		let location = { lat: params.lat, lng: params.lng };
		let nearest = getNearest(events, location, params.radius, params.limit);

		response.end(JSON.stringify(nearest));      
	});

Router.route('/api/ongs/:lat/:lng/:limit/:radius', { where: 'server' })
	.get(function () {
		let request = this.request;
		let params = this.params;
		let response = this.response;
		let ongs = Ongs.find().fetch();
		let location = { lat: params.lat, lng: params.lng };
		let nearest = getNearest(ongs, location, params.radius, params.limit);

		response.end(JSON.stringify(nearest));
	});

function getNearest(array, location, radius, limit) {
	let near = [];

	array.forEach((item) => {
		let distance = calculateDistanceSimple(item.location, location, radius);

		if (distance < radius) {
			item.distance = distance;
			near.push(item);
		}
	});

	near.sort(compare);

	if (near.length > limit)
		near =  near.splice(0, limit);

	return near
}

function calculateDistanceSimple(start, end, radius ) {
	let sin = Math.sin(toRad(end.lat)) * Math.sin(toRad(start.lat));
	let cos = Math.cos(toRad(end.lat)) * Math.cos(toRad(start.lat))*Math.cos(toRad(start.lng) - toRad(end.lng));
	let distance =  Math.acos(Math.min(1.0, sin+cos)) * 6371;

	return Math.round(distance);
}

function toRad(val) {
	return val * Math.PI / 180;
}

function compare(a, b) {
	if (a.distance < b.distance)
		return -1;
	if (a.distance > b.distance)
		return 1;

	return 0;
}