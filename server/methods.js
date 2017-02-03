/**
 * Created by andrey on 2/3/17.
 */

Meteor.methods({
   'test': () => {
      console.log(getLatLngFromAddress)
   },

   'removeSelectedFromUser': () => {
      let userId = Meteor.userId();

      Meteor.users.update(userId, { $set: { 'profile.selectedPage': null } });

   },

   'getEventsFromApi': (pageId, token) => {
      let user = Meteor.user();
      let accessToken = token ? token : user.services.facebook.accessToken;
      let page_id = pageId ? pageId : user.profile.selectedPage.id;
      let userId = Meteor.userId();
      let location = {};

      let pageUrl = 'https://graph.facebook.com/v2.8/'+ page_id +'?access_token='+ accessToken;
      pageUrl += '?&fields=events';
      let eventsResult = Meteor.http.get(pageUrl);
      let futureEvents = [];


      if (typeof eventsResult.data.events === 'undefined')
         return false;

      if (eventsResult.data.events.data) {
         futureEvents = getFutureEvents(eventsResult.data.events.data);
      }

      if (!futureEvents.length)
         return false;

      futureEvents.forEach((event) => {
         pageUrl = 'https://graph.facebook.com/v2.8/'+ event.id +'?access_token='+ accessToken;
         pageUrl += '?&fields=cover';

         let eventsResult = Meteor.http.get(pageUrl);

         if (eventsResult.data.cover.source){
            event.coverImage = eventsResult.data.cover.source;
         }

         if (typeof event.place.location !== 'undefined') {
            let curLocation = event.place.location;
            location = { lat: curLocation.latitude, lng: curLocation.longitude };    
         }

         location = getLatLngFromAddress(event.place.name || event.place.city, event.place.city);

         event.location = location;

         if (typeof event.place !== 'undefined')
            delete event.place

         if (!Events.find({ id: event.id }).count()) {
            event.owner = userId;
            event.selected = false;
            Events.insert(event);
         }
      });

      return true;
   }
});


const getFutureEvents = (events) => {
   let futureEvents = [];

   events.forEach((event) =>{
      if (new Date(event.start_time) > new Date()) {
         futureEvents.push(event);
      }
   });

   return futureEvents;
}

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