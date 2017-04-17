(function() {

    angular
        .module("WebDevMusicApp")
        .run(function($rootScope, $uibModalStack) {
            $uibModalStack.dismissAll();
        })
        .controller("UpcomingEventsController", UpcomingEventsController);

    function UpcomingEventsController ($location,UserService,EventService, $sce,$timeout,$routeParams,EmailService ,currentUser) {
        var vm = this;
        vm.tab=null;
        vm.followers = null ;
        vm.following = null ;
        vm.userId = currentUser._id ;
        vm.searchNearByEvents = searchNearByEvents;
        vm.error = null;
        vm.currentPage =0;
        vm.pageSize = 3;
        vm.dataLength =0;
        vm.userEvents = null;
        vm.noEventsFound = null;
        vm.searchUsers = searchUsers;
        vm.redirectToSearchedUser  = redirectToSearchedUser;
        vm.numberOfPages=0;
        vm.sendEmailInvitation = sendEmailInvitation;
        vm.closeModal = closeModal;
        vm.logout = logout;
        function showSpinner() {
            if (!vm.recordingFlag) {
                vm.recordingFlag = true;
            }
            return true;
        }


        function init() {
            vm.tab='EVENTBRITE';
            getUserDetails();
            showSpinner();
            searchNearByEvents();
            getAllEventsOfMyMusic();

        }
        init();

        function logout() {
            UserService
                .logout()
                .then(function () {
                    $location.url('/landingPage');
                });
        }


        function redirectToSearchedUser(userId2) {
            var promise = UserService.findUserById(userId2);
            promise.success (function (result) {
                if (result && result.status==='OK' && result.data) {
                    var searchedUser = result.data;
                    closeModal();
                    $timeout(function () {
                        if(searchedUser.userType == 'U')
                            $location.url("/user/userSearch/"+vm.userId+"/"+userId2);
                        else if(searchedUser.userType == 'M')
                        {
                            $location.url("/user/singerSearch/"+vm.userId+"/"+userId2);
                        }
                    }, 250);
                    vm.error = null;
                } else {
                    vm.error = "Some Error Occurred!! Please try again!";
                }

            }).error(function () {
                vm.error = "Some Error Occurred!! Please try again!";
            });
        }
        function closeModal() {
            vm.emailSuccess = null;
            vm.emailError = null;
            vm.error = null;
            $('.modal').modal('hide');
        }
        function searchUsers () {
            var promise = UserService.searchUsers(vm.inputQuery,vm.userId);
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
        function getAllEventsOfMyMusic () {

            var promise = EventService.getAllEventsOfMyMusic();
            promise.success (function (result) {
                if (result && result.status==='OK' && result.data) {
                    vm.userEvents = result.data;
                    vm.noEventsFound = null;
                    console.log(vm.events);

                } else {
                    if (result.status==='KO') {
                        if (result.description) {
                            vm.noEventsFound = result.description;
                        } else {
                            vm.noEventsFound = "Some Error Occurred!!";
                        }
                    }
                    else {
                        vm.noEventsFound = "Some Error Occurred!!";
                    }

                }

            }).error(function () {
                vm.noEventsFound = "Some Error Occurred!!";
            });
        }
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
                    vm.invitationEmail = null;

                } else {
                    vm.emailSuccess = null;
                    vm.emailError = "Some Error Occurred";
                }
            }).error(function () {
                vm.emailSuccess = null;
                vm.emailError = "Some Error Occurred";
            });
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
        function getUserDetails() {
            var promise = UserService.findUserById(vm.userId);
            promise.success (function (result) {
                if (result && result.status==='OK' && result.data) {
                    vm.followers = result.data.followers.length ;
                    vm.following = result.data.following.length ;
                    vm.error = null;
                    vm.user = result.data;
                } else {
                    vm.error = "Some Error Occurred!! Please try again!";
                }

            }).error(function () {
                vm.error = "Some Error Occurred!! Please try again!";
            });
        }
    }

})();