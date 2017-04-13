
/**
 * Created by sumitbhanwala on 3/10/17.
 */
module.exports = function () {

    // expsoing this particular api
    var api = {
        createEvent : createEvent ,
        updateEvent : updateEvent ,
        deleteEvent : deleteEvent,
        searchEvent : searchEvent,
        searchEventById : searchEventById
    };

    var mongoose = require('mongoose');
    var q = require('q');
    var eventSchema = require('./event.schema.server')();
    var eventModel = mongoose.model('eventModel', eventSchema);
    return api;



};