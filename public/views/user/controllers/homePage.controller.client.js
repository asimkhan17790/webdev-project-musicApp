(function() {

    angular
        .module("WebDevMusicApp")
        .run(function($rootScope, $uibModalStack) {
        $uibModalStack.dismissAll();
    })
    .controller("HomePageController",HomePageController);

    function HomePageController ($scope,EventService ,$sce,UserService ,$routeParams ,MusicService,$timeout,playListService,$location) {
        var vm = this;
        vm.searchNearByEvents = searchNearByEvents;
        vm.userId = $routeParams.uid ;
        vm.createplayList = createplayList ;
        vm.deleteplayList = deleteplayList ;
        vm.editProfile = editProfile ;
        vm.getTrsustedURL = getTrsustedURL;
        function init() {
           // searchNearByEvents();
           // searchAllPlaylists();
            getMusicUpdates();
            findAllPlayList();

        }
        init();

        function getMusicUpdates() {
            var promise = MusicService.getMusicUpdates();
            promise.success(function (response) {

                if (response.status=='ok') {
                    vm.musicArticles = response.articles;
                    console.log(vm.musicArticles);
                  //  geenerateNewsWidget();
                }else {
                    vm.musicArticles = null;
                }
            }).error(function (err) {
                vm.musicArticles = null;
            });
        }
        function findAllPlayList() {
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
    function geenerateNewsWidget() {

        var boxheight = angular.element(document.querySelector('.carousel-inner')).height();
        var itemlength = $('.item').length;
        var boxheight = 450;
        var itemlength = 10;
        var triggerheight = Math.round(boxheight/itemlength+1);
        angular.element(document.querySelector('.list-group-item')).height(triggerheight);

        var clickEvent = false;

        angular.element(document.querySelector('#newsCarousel')).carousel({
            interval:   2000
        }).on('click', '.list-group li', function() {
            clickEvent = true;
            angular.element(document.querySelector('.list-group li')).removeClass('active');
            $(this).addClass('active');
            $scope.$apply();
        }).on('slid.bs.carousel', function(e) {
            if(!clickEvent) {

                var count =  angular.element(document.querySelector('.list-group')).children().length -1;
                var current = angular.element(document.querySelector('.list-group li.active'));
                current.removeClass('active').next().addClass('active');
                var id = parseInt(current.data('slide-to'));
                if(count == id) {
                    angular.element(document.querySelector('.list-group li')).first().addClass('active');
                }
            }
            clickEvent = false;
            $scope.$apply();
        });
    }
        function editProfile() {
            $location.url("/user/editProfile/"+vm.userId);
        }

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

        function getTrsustedURL (url) {
           return  $sce.trustAsResourceUrl(url);
        }
    }

})();