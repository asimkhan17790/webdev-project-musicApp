/**
 * Created by sumitbhanwala on 4/6/17.
 */

module.exports = function (app ,listOfModel) {

    app.post("/api/event/:uid" ,createEvent);
    app.get("/api/event/search/:albumId",findEventById);
    app.delete("/api/event/:eid" ,deleteEvent);
    app.put("/api/event/:eid" ,updateEvent);
    app.get("/api/events/" ,findUpComingEvents);


    var albumModel = listOfModel.albumModel;
    var userModel = listOfModel.UserModel;
    var songModel = listOfModel.songModel;
    var eventModel = listOfModel.eventModel;


    function findUpComingEvents (req, res) {
        eventModel
            .findUpComingEvents()
            .then(function (eventsFound) {
                if (eventsFound && eventsFound.length > 0) {
                    res.json({status:'OK',data:eventsFound});
                }
                else {
                    res.json({status:'KO',description:"No Event found!! Check this page again in a while"});
                }

            } , function (err) {
                res.json({status:'KO',description:'Some error occurred!!'});
            });
    }

    function createEvent (req, res) {
        var response ={};
        // checking for existing user name
        var event = req.body;
        var uid = req.params.uid;
        eventModel.createEvent(uid,event)

            .then(function (createdEventId) {
                return userModel.addEventToUser(uid, createdEventId);
            })
            .then(function (createdEventId) {
                    response = {status:"OK",
                        description:"Event successfully created",
                        data:createdEventId};
                    res.json(response);
                    return;
                },
                function(err) {
                    res.json(err);
                    return;
                });

    }
    function findEventById(req, res) {

        var eventId = req.params.eid;
        userModel
            .findEventById(eventId)
            .then(function (eventFound) {
                res.json({status:'OK',data:eventFound});
            } , function (err) {
                res.json({status:'KO',data:err});
            });

    }
    function deleteEvent(req, res) {

        var eventId= req.params.eid;
        eventModel.findEventById(eventId)
            .then(function (event) {
                var userId=event._user;
                eventModel.deleteEvent(eventId)
                    .then(function () {
                        userModel.deleteEventIdFromUser(userId, eventId)
                            .then(function () {
                                res.status(200).send("OK");
                            }, function () {
                                res.status(500).send("Some Error Occurred!!");
                                return;
                            })
                    }, function () {
                        res.status(500).send("Some Error Occurred!!");
                        return;
                    });
            }, function () {
                res.status(500).send("Some Error Occurred!!");
                return;
            });
    }

    function updateEvent(req, res) {

        var eventId = req.params.eid;
        var newEvent = req.body;
        var response = {};
        eventModel.updateEvent(eventId, newEvent)
            .then(function (updatedEvent) {
                    response = {
                        status:"OK",
                        description:"Event successfully updated",
                        data:updatedEvent};
                    res.json(response);
                    return;
                },
                function(err) {
                    res.status(500).send("Some Error Occurred!!");
                    return;
                });
    }
}