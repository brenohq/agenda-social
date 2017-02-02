ServiceConfiguration.configurations.remove({
    service: 'facebook'
});
 
ServiceConfiguration.configurations.insert({
    service: 'facebook',
    appId: '1120251358083242',
    secret: 'fbf909c3ec7c5c89cde95bcc7cab0ada',
    requestPermissions: ['user_friends', 'public_profile', 'email']
});

// Accounts.onCreateUser(function(options, user) {
	
// 	console.log('user', user)
// 	console.log('options', options)

// 	return false;
// })
