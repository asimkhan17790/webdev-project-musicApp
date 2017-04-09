(function() {

    angular
        .module("WebDevMusicApp")
        .run(function($rootScope, $uibModalStack) {
        $uibModalStack.dismissAll();
    })
    .controller("HomePageController",HomePageController);

    function HomePageController ($scope,EventService) {

        var vm = this;
        vm.searchNearByEvents = searchNearByEvents;
        vm.users = [
            {
                firstName : "Asim",
                lastName : "Khan",
                imageURL : ""
            },{
                firstName : "Saurabh",
                lastName : "Singh",
                imageURL : ""
            },{
                firstName : "Raj",
                lastName : "chawdhary",
                imageURL : ""
            },{
                firstName : "Sumit",
                lastName : "Bhanwala",
                imageURL : ""
            }
        ];


        function init() {
           // searchNearByEvents();
        }
        init();



        function searchNearByEvents() {
            console.log('searchNearByEvents');

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    var cord = {
                        latitude : position.coords.latitude,
                        longitude : position.coords.longitude
                    };
                    var inputFilter = {
                        cords : cord
                    }
                    callSearchEventService(inputFilter);

                }, function (error) {
                    console.log(error);
                    callSearchEventService(null);
                });
            } else {
                console.log('Geolocation is not supported by this browser.');
                callSearchEventService(null);
                return null;
            }
        }
        function callSearchEventService(inputFilter) {
            var promise =  EventService.searchNearByEvents(inputFilter);
            promise.success(function (response) {
                console.log(response);
                vm.events = response.events;

            }).error(function (error) {
                console.log(error);
            });
        }

    }

})();