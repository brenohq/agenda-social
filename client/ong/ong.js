/**
 * Created by andrey on 2/2/17.
 */

Template.ong.helpers({
    'qty_ongs': function(){
        if(Meteor.user()){
            console.log(Meteor.user().profile.pages);
            return Meteor.user().profile.pages;
        }
        return 0;
    }
});