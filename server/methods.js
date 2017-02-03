/**
 * Created by andrey on 2/3/17.
 */

Meteor.methods({
   'removeSelectedFromUser': () => {
      let userId = Meteor.userId();

      Meteor.users.update(userId, { $set: { 'profile.selectedPage': null } });

   },

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

      if (!futureEvents.length)
         return false;

      futureEvents.forEach((event) => {
         pageUrl = 'https://graph.facebook.com/v2.8/'+ event.id +'?access_token='+ accessToken;
         pageUrl += '?&fields=cover';

         let eventsResult = Meteor.http.get(pageUrl);

         if (eventsResult.data.cover.source){
            event.coverImage = eventsResult.data.cover.source;
         }

         if (!Events.find({ id: event.id }).count()) {
            event.owner = userId;
            event.selected = false;
            Events.insert(event);
         }
      });

      return true;
   },

   'closestEvents': (location) => {
      const request = Meteor.http.get;

      let begin = {
         lat: -23.5246611,
         lon: -46.7313022
      }

      let end = {
         lat: -20.3886024,
         lon: -44.4938625
      }

      let origin = begin.lat + ',' + begin.lon;
      let destination = end.lat + ',' + end.lon;

      let url = "https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=" + origin + "&destinations=" + destination + "&key=AIzaSyAMHSYI2hMp1JUGPES1dvEn9-cW5UZEcNE";

      request(url, function(error, response, body) {
         if (!error && response.statusCode == 200) {
            console.log(body); // body contém distância, duração do trajeto e outras informações úteis
         } else {
            console.log('Erro: ', error);
            console.log('Status Code: ', response.statusCode);
         }
      })

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

function calculateDistanceSimple(start, end) {

    var sin = Math.sin(toRad(end.lat)) * Math.sin(toRad(start.lat));
    var cos = Math.cos(toRad(end.lat)) * Math.cos(toRad(start.lat))*Math.cos(toRad(start.lng) - toRad(end.lng));
    var distance =  Math.acos(Math.min(1.0, sin+cos)) * RADIUS;

    return Math.round(distance);
}