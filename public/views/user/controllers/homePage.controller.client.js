(function() {

    angular
        .module("WebDevMusicApp")
        .run(function($rootScope, $uibModalStack) {
        $uibModalStack.dismissAll();
    })
    .controller("HomePageController",HomePageController);

    function HomePageController (EmailService,EventService ,$sce,UserService ,$routeParams ,MusicService,$timeout,playListService,$location) {
        var vm = this;
        vm.searchNearByEvents = searchNearByEvents;
        vm.userId = $routeParams.uid ;
        vm.createplayList = createplayList ;
        vm.deleteplayList = deleteplayList ;
        vm.editProfile = editProfile ;
        vm.error = null;
        vm.user = null;
        vm.getTrsustedURL = getTrsustedURL;
        vm.followers = null ;
        vm.following = null ;
        vm.searchUsers = searchUsers ;
        vm.clearUserFromModal  = clearUserFromModal;
        vm.redirectToSearchedUser  = redirectToSearchedUser;
        vm.sendEmailInvitation = sendEmailInvitation;
        function init() {
            searchNearByEvents();
           // searchAllPlaylists();
            getUserDetails ();
            getMusicUpdates();
            findAllPlayList();
        }
        init();

        function sendEmailInvitation () {
            var emailInput = {
                emailAddress: vm.invitationEmail,
                firstName : vm.user.firstName
            };
            var promise = EmailService.sendEmailInvitation(emailInput);
            promise.success (function (result) {
                if (result && result.status === 'OK') {
                    if (result.description) {
                        vm.emailSuccess = result.description;
                    }
                    else {
                        vm.emailSuccess = 'Congrats...Your invitation has been sent successfully!!';
                    }

                  /*  $timeout(function () {
                            closeModal();
                    }, 2000);*/
                } else {
                        vm.emailSuccess = null;
                        vm.emailError = "Some Error Occurred";
                }
            }).error(function () {
                vm.emailSuccess = null;
                vm.emailError = "Some Error Occurred";
            });
        }

        function clearUserFromModal() {
            vm.users = null;
            vm.error = null;
            vm.inputQuery = null;
            vm.invitationEmail = null;
            vm.emailSuccess = null;
            vm.emailError = null;
        }
        
        function redirectToSearchedUser(userId2) {
            closeModal();
            $timeout(function () {
                $location.url("/user/userSearch/"+vm.userId+"/"+userId2);
            }, 250);
        }

        function searchUsers () {
            var promise = UserService.searchUsers(vm.inputQuery);
            promise.success (function (result) {
                if (result && result.status==='OK' && result.data && result.data.length >0) {
                    vm.users = result.data;
                    vm.error = null;
                } else {
                    vm.users = null;
                    vm.error = "No user found !!";
                }
            }).error(function () {
                vm.users = null;
                vm.error = "Some Error Occurred!! Please try again!";
            });
        }

        function getUserDetails() {
            var promise = UserService.findUserById(vm.userId);
            promise.success (function (result) {
                if (result && result.status==='OK' && result.data) {
                    vm.user = result.data;
                    vm.followers = result.data.followers.length ;
                    vm.following = result.data.following.length ;
                    vm.error = null;
                } else {
                    vm.error = "Some Error Occurred!! Please try again!";
                }

            }).error(function () {
                    vm.error = "Some Error Occurred!! Please try again!";
                });
        }

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

        function editProfile() {
            $location.url("/user/editProfile/"+vm.userId);
        }

        function closeModal() {

            vm.inputQuery = null;
            vm.invitationEmail = null;
            vm.emailSuccess = null;
            vm.emailError = null;
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