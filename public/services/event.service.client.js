(function () {
    angular
        .module("WebDevMusicApp")
        .factory("EventService", EmailService);

    function EmailService($http) {

        var api = {
            searchNearByEvents: searchNearByEvents,
            searchEventCategories : searchEventCategories
        };

        return api;

        function searchNearByEvents (inputFilter) {
            return $http.post("/api/eventbrite/events", inputFilter);
        }
        function searchEventCategories () {
                return $http.get("/api/eventbrite/events/categories");
        }

    }

})();