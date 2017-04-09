(function() {

    angular
        .module("WebDevMusicApp")
        .run(function($rootScope, $uibModalStack) {
        $uibModalStack.dismissAll();
    })
    .controller("HomePageController",HomePageController);

    function HomePageController ($scope,EventService ,UserService ,$routeParams ,StaticDataService,$timeout,playListService) {
        var vm = this;
        vm.searchNearByEvents = searchNearByEvents;
        vm.userId = $routeParams.uid ;
        vm.createplayList = createplayList ;
        vm.deleteplayList = deleteplayList ;
        function init() {
           // searchNearByEvents();
           // searchAllPlaylists();
            var promise = UserService.findAllplayList(vm.userId);
            promise.success(function (user) {
                vm.playLists = user.playList ;
                console.log(vm.playLists);

            })
            promise.error(function (err) {
                console.log("some error occured " + err);
                vm.playLists = null ;
            })
        }
        init();


        function closeModal() {
            $('.modal').modal('hide');
        }
        function deleteplayList(playList) {
            var promise = playListService.deleteplayList(playList);
            promise.success(function(playList) {
                if(playList){
                    init();
                }
            })
            promise.error(function (err) {
                vm.error = "PlayList Not found";
            })
        }
        
        function createplayList() {
            vm.playlist.playListOwner =  vm.userId;
            var promise = playListService.createplayList(vm.playlist);
            promise.success(function(playlist) {
                if(playlist){
                    closeModal();
                    vm.playlist = {};
                    $timeout(function () {
                        // probably will handle the redirection to the
                        // album default page
                        init();
                    }, 250);
                }
            })
            promise.error(function (err) {
                vm.error = "User Not found";
            })
        }

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