(function () {
    angular
        .module("WebDevMusicApp")
        .factory("EventService", EventService);

    function EventService($http) {

        var api = {
            searchNearByEvents: searchNearByEvents,
            searchEventCategories : searchEventCategories,
            createEvent : createEvent,
            getAllEventsOfUser : getAllEventsOfUser,
            updateEvent : updateEvent,
            deleteEvent : deleteEvent,
            getAllEventsOfMyMusic : getAllEventsOfMyMusic
        };

        return api;

        function getAllEventsOfMyMusic() {
            return $http.get("/api/events/");
        }

        function getAllEventsOfUser(userId) {
            return $http.get("/api/user/findAllEventsOfUser/" + userId);
        }

        function createEvent (event,userId) {
            return $http.post("/api/event/"+userId, event);
        }
        function updateEvent (event) {
            return $http.put("/api/event/" + event._id, event);
        }
        function deleteEvent(event) {
            return $http.delete("/api/event/" + event._id, event);

        }
        function searchNearByEvents (inputFilter) {
            return $http.post("/api/eventbrite/events", inputFilter);
        }
        function searchEventCategories () {
                return $http.get("/api/eventbrite/events/categories");
        }

    }

})();