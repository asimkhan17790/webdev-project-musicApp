(function() {

    angular
        .module("WebDevMusicApp")
        .controller("UserProfileController",UserProfileController);

    function UserProfileController ($location, UserService ,$routeParams,StaticDataService ,$timeout ,currentUser) {

        var vm = this;
        vm.userId = $routeParams.uidS ;
        vm.pid = currentUser._id;
        vm.followUser = followUser;
        vm.unfollowUser = unfollowUser;
        vm.findPlayList = findPlayList;
        vm.followUserThisPlayList = followUserThisPlayList;
        vm.notFollowing = null;
        vm.redirectToSearchedUser  = redirectToSearchedUser;
        vm.searchUsers = searchUsers;
        vm.logout = logout ;
        vm.sendEmailInvitation = sendEmailInvitation ;
        function init() {
            getUserDetails();
            getfollowing();
            findPlayList();
        }
        init();

        function followUserThisPlayList (playList) {
            $location.url("/user/userSearch/playList/songs/"+vm.userId+"/"+playList._id);
        }


        function logout() {
            UserService
                .logout()
                .then(function () {
                    $location.url('/landingPage');
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

        function searchUsers () {
            var promise = UserService.searchUsers(vm.inputQuery ,vm.pid);
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
        function redirectToSearchedUser(userId2) {
            vm.users = null;
            vm.inputQuery = null;
            var promise = UserService.findUserById(userId2);
            promise.success (function (result) {
                if (result && result.status==='OK' && result.data) {
                    var searchedUser = result.data;
                    closeModal();
                    $timeout(function () {
                        if(searchedUser.userType == 'U')
                            $location.url("/user/userSearch/"+userId2);
                        else if(searchedUser.userType == 'M')
                        {
                            $location.url("/user/singerSearch/"+userId2);
                        }
                    }, 250);
                    vm.follError = null;
                } else {
                    vm.follError = "Some Error Occurred!! Please try again!";
                }

            }).error(function () {
                vm.follError = "Some Error Occurred!! Please try again!";
            });
        }
        function getUserDetails() {
            var promise = UserService.findUserById(vm.userId);
            promise.success (function (result) {
                if (result && result.status==='OK' && result.data) {
                    vm.user = result.data;
                } else {
                    vm.error = "Some Error Occurred!! Please try again!";
                }

            }).error(function () {
                vm.error = "Some Error Occurred!! Please try again!";
            });
        }
        function getfollowing() {
            var promise = UserService.isFollowing(vm.userId ,vm.pid);
            promise.success (function (result) {
                if (result && result.status==='OK' && result.data) {
                    vm.isFollowing = result.data;
                } else {
                    vm.error = "Some Error Occurred!! Please try again!";
                }

            }).error(function () {
                vm.error = "Some Error Occurred!! Please try again!";
            });
        }

         function followUser() {
             vm.playlists = null;
            var promise =  UserService.followUser(vm.userId ,vm.pid);
             promise.success (function (user) {
                init();
             }).error(function () {
                 vm.error = "Some Error Occurred!! Please try again!";
             });
         }

        function unfollowUser() {
            vm.playlists=null;
           var promise = UserService.unfollowUser(vm.userId ,vm.pid);
            promise.success (function (user) {
                init();
            }).error(function () {
                vm.error = "Some Error Occurred!! Please try again!";
            });
        }
        // vm.pid is the person whom we wanna show the playlist of the vm.userId
        // so we check if in vm.pid is following  vm.userId.
        function findPlayList() {
            var promise = UserService.findAllplayListAndFollowing(vm.userId ,vm.pid);
            promise.success (function (result) {
                if (result && result.status==='OK' && result.data != null) {
                    vm.playlists = result.data.playList;
                    vm.notFollowing=null;
                }
                else if(result && result.status==='OK' && !result.data)
                {
                    vm.notFollowing = result.description;
                }
                else
            {
                vm.error = "Some Error Occurred!! Please try again!";
            }
            }).error(function () {
                vm.error = "Some Error Occurred!! Please try again!";
            });
        }

    }
    function closeModal() {

        $('.modal').modal('hide');
    }

})();