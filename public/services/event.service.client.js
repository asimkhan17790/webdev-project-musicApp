(function () {
    angular
        .module("WebDevMusicApp")
        .factory("EventService", EventService);

    function EventService($http) {

        var api = {
            searchNearByEvents: searchNearByEvents,
            searchEventCategories : searchEventCategories,
            createEvent : createEvent,
            getAllEventsOfUser : getAllEventsOfUser
        };

        return api;

        function getAllEventsOfUser(userId) {
            return $http.get("/api/user/findAllEventsOfUser/" + userId);
        }

        function createEvent (event,userId) {
            return $http.post("/api/event/"+userId, event);
        }
        function searchNearByEvents (inputFilter) {
            return $http.post("/api/eventbrite/events", inputFilter);
        }
        function searchEventCategories () {
                return $http.get("/api/eventbrite/events/categories");
        }

    }

})();