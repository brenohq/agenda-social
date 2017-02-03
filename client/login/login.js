Template.login.events({
  'click #facebook-login': () => {
    $('#facebook-login').toggleClass('is-loading');
    Meteor.loginWithFacebook({
      requestPermissions: ['manage_pages'],
      requestOfflineToken: true
    });
  },

  'click #logout': () => {
    Meteor.logout();
  }
});