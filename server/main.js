import { Meteor } from 'meteor/meteor';
const token = 'EAACEdEose0cBACINq36elPj3BeJkLd0o8ZASfglr6ymp9LqET5ZCRY2fN5EMAfY7rrGM3qHwnAiyFZA9CPsGCZBNS8JBpalsLokFRDlHPnZALkjpqpGeIaqMPFMl7ilh5MLW8BRCFIcIdPORPxn2OYtqHul2dXvLrDo4W79nYt2nbmtQpboadGflHlLunj48ZD';

Meteor.startup(() => {
	// Mudar token antes de tirar o return

	return;
	const ongs = [
		'onghumanimal',
		'anjosdamadrugada01',
		'projetomaisqueumvingador',
		'sevensanguebom',
		'assistrj',
		'SonharAcordadoCuritiba',
		'GRAACC',
		'amamoscasadeacolhimento',
		'projetoabraco',
		'ONGArtsol',
		'sonharacordadocampinas',
		'ONGSonharAcordadoSP',
		'atadosjuntandogenteboa',
		'CadiBrasil',
		'caosemdono',
		'xododebicho'
	]

	let events = [];

	ongs.forEach((ong, i) => {		
		let pageUrl = `https://graph.facebook.com/v2.8/${ ong }?access_token=${ token }`;
		pageUrl += '?&fields=cover,about,description,category,picture,name,location,events';

		let pageResult = Meteor.http.get(pageUrl);
		let parsedPage = JSON.parse(pageResult.content);

		if (parsedPage.cover) {
			parsedPage.coverImage = parsedPage.cover.source;
			delete parsedPage.cover;
		}

		if (parsedPage.picture) {
			parsedPage.image = parsedPage.picture.data.url;
			delete parsedPage.picture;
		}

		if (typeof parsedPage.about === 'undefined')
			parsedPage.about = parsedPage.description;

		if (typeof parsedPage.location === 'undefined') {
			parsedPage.location = getLocationFromFirstEvent(parsedPage.events);
		} else {
			parsedPage.location = getLatLngFromAddress(
				parsedPage.location.street || parsedPage.location.city,
				parsedPage.location.city
			);
		}

		Meteor.call('getEventsFromApi', parsedPage.id, token, (err, data) => {
			if (typeof parsedPage.events !== 'undefined')
				delete parsedPage.events

			if (!Ongs.find({ id: parsedPage.id }).count()) {
				Ongs.insert(parsedPage);
			}			
		});
	});
});

function getLatLngFromAddress(address, secondResource) {
	let url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURI(address);
	url += '&key=AIzaSyC1c1A-_0JNhx1TEcA3PEBmB0u92f10K9Y';
	let location = Meteor.http.get(url);
	let geometry = {};

	if (typeof location.data.results[0] !== 'undefined') {
		geometry = location.data.results[0].geometry;
	} else {
		geometry = location.data.results.geometry;
	}

	if (typeof geometry === 'undefined' && secondResource) {
		return getLatLngFromAddress(secondResource, false);

	} else {
		return geometry.location;
	}
}

function getLocationFromFirstEvent(events) {
	let lastEvent = events.data[0];

	if (typeof lastEvent.place.location !== 'undefined') {
		let location = lastEvent.place.location;
		return { lat: location.latitude, lng: location.longitude };		
	}

	return getLatLngFromAddress(lastEvent.place.name);
}