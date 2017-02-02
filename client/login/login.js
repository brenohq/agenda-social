
// Session.setDefault('fb-user', false);
// Session.setDefault('user', false);

// Template.fb.helpers({
// 	user() {
// 		let fbUser = Session.get('fb-user');
// 		let userData = Session.get('user');

// 		if (fbUser && !userData) {
// 			let token = fbUser.accessToken;
// 			let id = fbUser.userID;
// 			let url = `https://graph.facebook.com/v2.8/${ id }/accounts?access_token=${ token }`;

// 			HTTP.get(url, (err, res) => {
// 				if (!err) {
// 					console.log(err, res);
// 					let page = res.data.data[0];
// 					Session.set('user', page.name);
// 					Session.set('page', page);
					
// 					getPageInfo(page.access_token, page.id, (res) => {
// 						console.log(res);
// 					});

// 				} else {
// 					Session.set('loading', false);
// 				}
// 			});
// 		}

// 		return Session.get('user');
// 	}
// });

// function getPageInfo(token, id, cb = () => { }) {
// 	let url = `https://graph.facebook.com/v2.8/${ id }?access_token=${ token }`;
// 	url += '?&ields=cover,description,category,picture';

// 	HTTP.get(url, (err, res) => {
// 		if (!err) {
// 			Session.set('loading', true);
// 			cb(res);
// 		} else {
// 			Session.set('loading', false);
// 		}
// 	});
// }