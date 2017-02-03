let timer = 0;
let time = 0;
Session.setDefault('progress', 0);

Template.dashboard.helpers({
  userPages() {
    if (Meteor.user()) {
      return Meteor.user().profile.pages;
    }

    return []
  },

  selectedPage() {
    if (Meteor.user() && Meteor.user().profile.selectedPage !== null) {
      return Meteor.user().profile.selectedPage;
    }
  },

});

Template.pageEvents.helpers({
  getEvents() {
    return Meteor.user().profile.events;
  },

  getProgress() {
    // Mockando progresso
    clearTimeout(timer);
    timer = setTimeout(() => {
      let progress = Session.get('progress');
      if (progress > 100) {
        clearTimeout(timer);
        $('.progress').remove();
        Meteor.call('getEventsFromApi', Meteor.user(), function() {

        });

        return;
      }

      Session.set('progress', progress + 2)
    }, 100);

    return Session.get('progress');

  }
});

Template.dashboard.events({
  'click .card': (e, tpl) => {
    let page = Blaze.getData(e.target);
    let userId = Meteor.userId();

    Session.set("selectedPage", page);
    Session.set('progress', 0);
    Meteor.users.update(userId, {
      $set: {
        'profile.selectedPage': page
      }
    }, () => {
      // CB
    });
  }

});