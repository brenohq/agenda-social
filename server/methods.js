/**
 * Created by andrey on 2/3/17.
 */

Meteor.methods({
   'getEventsFromApi': function(){
      let accessToken = Meteor.user().services.facebook.accessToken;
      let page_id = Meteor.user().profile.selectedPage.id;
      let userId = Meteor.userId();
      
      console.log("Meteor",Meteor.user(),"AccessToken:",accessToken,"Page_id:",page_id);
      let pageUrl = 'https://graph.facebook.com/v2.8/'+ page_id +'?access_token='+ accessToken;
      pageUrl += '?&fields=events';
      let eventsResult = Meteor.http.get(pageUrl);
      let futureEvents = [];
      if(eventsResult.data.events.data){
         futureEvents = getFutureEvents(eventsResult.data.events.data);
      }
      futureEvents.forEach(function(event){
         pageUrl = 'https://graph.facebook.com/v2.8/'+ event.id +'?access_token='+ accessToken;
         pageUrl += '?&fields=cover';
         let eventsResult = Meteor.http.get(pageUrl);
         console.log("eventsResult:",eventsResult);

         if(eventsResult.data.cover.source){
            event.coverImage = eventsResult.data.cover.source;
         }

      });
      console.log("userId:",userId,futureEvents);

      Meteor.users.update(userId, { $set: { 'profile.events': futureEvents} }, () => {
         // CB
        console.log("Profile",Meteor.user().profile);
      });
   }

});


var getFutureEvents = function(events){

   let futureEvents = [];


   events.forEach(function(event){

      if(new Date(event.start_time) > new Date()){
         futureEvents.push(event);
      }

   });

   return futureEvents;
}
