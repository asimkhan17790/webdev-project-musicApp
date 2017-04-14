
/**
 * Created by sumitbhanwala on 3/10/17.
 */
module.exports = function () {

    // expsoing this particular api
    var api = {
        createEvent : createEvent ,
        updateEvent : updateEvent ,
        deleteEvent : deleteEvent,
       /* searchEventByName : searchEventName,*/
        findEventById : findEventById
    };

    var mongoose = require('mongoose');
    var q = require('q');
    var eventSchema = require('./event.schema.server')();
    var EventModel = mongoose.model('eventModel', eventSchema);
    return api;

    function createEvent(uid, eventObject) {

        var q1 = q.defer() ;
        eventObject._user = uid;
        EventModel.create(eventObject ,function (err , createEvent) {
            if(err){
                q1.reject(err);
            }
            else
            {
                q1.resolve(createEvent._id);
            }
        });
        return q1.promise;
    }
    function updateEvent(eventId, eventObject) {

        var deferred =  q.defer();
        EventModel.findOne({_id:eventId}, function(err, foundEvent) {
            if (err){
                deferred.reject(err);
            }
            else if (foundEvent){
                foundEvent.eventName = eventObject.eventName;
                foundEvent.description = eventObject.description;
                foundEvent.startDate = eventObject.startDate;
                foundEvent.endDate = eventObject.endDate;
                foundEvent.venue = eventObject.venue;
                foundEvent.longitude = eventObject.longitude;
                foundEvent.latitude = eventObject.latitude;
                foundEvent.imageUrl = eventObject.imageUrl;
                foundEvent.save(function (err, updatedEvent) {
                    if (err) {
                        deferred.reject(err);
                    }
                    else {
                        deferred.resolve(updatedEvent);
                    }
                });
            }
            else {
                deferred.resolve(null);
            }
        });

        return deferred.promise;
    }

    function deleteEvent(eventId) {
        var deferred =  q.defer();
        EventModel.findOneAndRemove({_id:eventId}, function(err, foundEvent) {
            if (err){
                deferred.reject(err);
            }
            else {
                deferred.resolve(deleteEvent);
            }

        });
        return deferred.promise;
    }

    function findEventById(eventId) {
        var deferred =  q.defer();
        EventModel.findOne({_id : eventId}, function(err, event) {
            if (err){
                deferred.reject(err);
            }
            else {
                deferred.resolve(event);
            }
        });

        return deferred.promise;
    }

};