ServiceConfiguration.configurations.remove({
    service: 'facebook'
});
 
ServiceConfiguration.configurations.insert({
    service: 'facebook',
    appId: '1120251358083242',
    secret: 'fbf909c3ec7c5c89cde95bcc7cab0ada',
    requestPermissions: ['user_friends', 'public_profile', 'email']
});

// Meteor.loginWithFacebook({
// 	requestPermissions: ["manage_pages","publish_stream"],
// 	requestOfflineToken: true
// });

Accounts.onCreateUser(function(options, user) {
	user.profile = options.profile;
	let token = user.services.facebook.accessToken;
	let userId = user.services.facebook.id;
	let url = `https://graph.facebook.com/v2.8/${ userId }/accounts?access_token=${ token }`;
	let pages = [];
	let loaded = 0;
	let result = Meteor.http.get(url);
	let content = JSON.parse(result.content);
	let userPages = content.data;

	userPages.forEach((page, i) => {
		let pageUrl = `https://graph.facebook.com/v2.8/${ page.id }?access_token=${ page.access_token }`;
		pageUrl += '?&fields=cover,description,category,picture,name';
		let pageResult = Meteor.http.get(pageUrl);
		let parsedPage = JSON.parse(pageResult.content);
		//parsedPage.coverImage = parsedPage.cover.source;
		//delete parsedPage.cover;
		//parsedPage.image = parsedPage.picture.data.url;
		//delete parsedPage.picture;

		pages.push(parsedPage);
	});

	user.profile.pages = pages;
	
	return user;
});