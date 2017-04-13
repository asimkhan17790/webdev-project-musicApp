(function() {

    angular
        .module("WebDevMusicApp")
        .run(function($rootScope, $uibModalStack) {
            $uibModalStack.dismissAll();
        })
        .controller("UpcomingEventsController", UpcomingEventsController);

    function UpcomingEventsController ($scope,EventService, $sce,$timeout,Upload,MusicService,$routeParams) {

        var vm = this;
        vm.userId = $routeParams.uid ;
        vm.searchNearByEvents = searchNearByEvents;
        vm.error = null;
        vm.currentPage =0;
        vm.pageSize = 3;
        vm.dataLength =0;

        vm.numberOfPages=0;
        function showSpinner() {
            if (!vm.recordingFlag) {
                vm.recordingFlag = true;
            }
            return true;
        }


        function init() {
            showSpinner();
            searchNearByEvents();

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
                vm.recordingFlag = false;
                vm.events = response.events;
                vm.dataLength = vm.events.length;
                vm.numberOfPages= Math.ceil(vm.dataLength/vm.pageSize);

                }).error(function (error) {
                console.log(error);
            });
        }
        function getTrsustedURL (url) {
            return  $sce.trustAsResourceUrl(url);
        }

        function showSpinner() {
            if (!vm.recordingFlag) {
                vm.recordingFlag = true;
            }
            return true;
        }
        function getTrustedHtml(html) {
            return $sce.trustAsHtml(html);
        }
    }

})();