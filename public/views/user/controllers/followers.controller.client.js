/**
 * Created by sumitbhanwala on 4/12/17.
 */
(function() {
    angular
        .module("WebDevMusicApp")
        .controller("FollowerController", FollowerController);

    function FollowerController (MusicService,playListService,$location ,currentUser,$routeParams ,UserService,$timeout,EmailService) {
        var vm = this;
        vm.userId = currentUser._id;
        vm.followers = null;
        vm.following = null;
        vm.followersLength=null;
        vm.searchUsers = searchUsers;
        vm.clearUserFromModal  = clearUserFromModal;
        vm.redirectToSearchedUser  = redirectToSearchedUser;
        vm.sendEmailInvitation = sendEmailInvitation;
        vm.searchSongs = searchSongs;
        vm.redirectToSearchedSong = redirectToSearchedSong;
        function init() {
            getUserDetails();
            var promise = UserService.findFollowersById(vm.userId);
            promise.success (function (result) {
                if (result && result.status==='OK' && result.data && result.data.length >0) {
                    vm.followers = result.data;
                    vm.follError = null;
                } else {
                    vm.followers = null;
                    vm.follError = "You have no followers ";
                }
            }).error(function () {
                vm.followers = null;
                vm.follError = "Some Error Occurred!! Please try again!";
            });

        }
        init();

        function searchSongs () {
            var promise = MusicService.searchSongs(vm.inputSong);
            promise.success (function (result) {
                if (result && result.status === 'OK' && result.data && result.data.length > 0) {
                    console.log(result.data);
                    vm.searchedSongs = result.data;
                    vm.songError = null;
                } else {
                    vm.searchedSongs = null;
                    vm.songError = "No such song found !!";
                }
            }).error(function () {
                vm.searchedSongs = null;
                vm.songError = "Some Error Occurred!! Please try again!";
            });
        }
        function redirectToSearchedSong (selectedSong) {

            closeModal();
            $timeout(function () {
                if (selectedSong.origin === 'mymusic') {
                    $location.url("/music/song/songDetails/"+selectedSong._id);
                }
                else {

                    getSpotifySong(selectedSong);
                    //$location.url("/music/song/songDetails/"+selectedSong._id);
                }
            }, 250);

            console.log('redirecting');
        }
        function getSpotifySong(selectedSong) {

            var promise  = playListService.createSong(selectedSong);
            promise.success(function (result) {
                if (result) {

                    $location.url("/music/song/songDetails/"+result._id);

                } else {
                    console.log('some error occurred!');
                }

            }).error(function (err) {
                console.log('some error occurred!');
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
        function closeModal() {
            vm.searchedSongs = null;
            $('.modal').modal('hide');
        }

        function redirectToSearchedUser(userId2) {
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

        function searchUsers () {
            var promise = UserService.searchUsers(vm.inputQuery ,vm.userId);
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
                    vm.followersLength = result.data.followers.length ;
                    vm.following = result.data.following.length ;
                    vm.user = result.data;
                    vm.follError = null;
                } else {
                    vm.follError = "Some Error Occurred!! Please try again!";
                }

            }).error(function () {
                vm.follError = "Some Error Occurred!! Please try again!";
            });
        }
        function clearUserFromModal() {
            vm.users = null;
            vm.error = null;
            vm.inputQuery = null;
            vm.emailSuccess = null;
            vm.emailError = "null";
            vm.searchedSongs = null;

        }

    }
})();