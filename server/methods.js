/**
 * Created by andrey on 2/3/17.
 */

Meteor.methods({
   'getEventsFromApi': () => {
      let user = Meteor.user();
      let accessToken = user.services.facebook.accessToken;
      let page_id =user.profile.selectedPage.id;
      let userId = Meteor.userId();

      let pageUrl = 'https://graph.facebook.com/v2.8/'+ page_id +'?access_token='+ accessToken;
      pageUrl += '?&fields=events';
      let eventsResult = Meteor.http.get(pageUrl);
      let futureEvents = [];


      if (typeof eventsResult.data.events === 'undefined')
         return false;

      if (eventsResult.data.events.data) {
         futureEvents = getFutureEvents(eventsResult.data.events.data);
      }

      futureEvents.forEach((event) => {
         pageUrl = 'https://graph.facebook.com/v2.8/'+ event.id +'?access_token='+ accessToken;
         pageUrl += '?&fields=cover';

         let eventsResult = Meteor.http.get(pageUrl);

         if (eventsResult.data.cover.source){
            event.coverImage = eventsResult.data.cover.source;
         }

         if (!Events.find({ id: event.id }).count()) {
            console.log('oe')
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
