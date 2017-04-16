/**
 * Created by Asim on 30-03-2017.
 */
(function() {

    angular
        .module("WebDevMusicApp")
        .controller("AllPlayListController",PlayListController);


    function PlayListController(EmailService,$location,$timeout,UserService,$routeParams,playListService ,currentUser) {

        var vm = this;
        vm.followers = null ;
        vm.following = null ;
        vm.userId = currentUser._id;
        vm.error = null;
        vm.createError = null;
        vm.closeModal = closeModal;
        vm.clearDataFromModal = clearDataFromModal;
        vm.newplayList = null;
        vm.createPlayList = createPlayList;
        vm.openPlaylist = openPlaylist
        vm.deleteplayList = deleteplayList ;
        vm.selectedPlaylistToDelete = null;
        vm.selectPlaylist = selectPlaylist;
        vm.searchUsers = searchUsers;
        vm.redirectToSearchedUser  = redirectToSearchedUser;
        vm.sendEmailInvitation = sendEmailInvitation;
        function init() {
            getUserDetails();
            findAllPlayList();
        }
        init();

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
        function selectPlaylist(selectedPlaylist) {
            vm.selectedPlaylistToDelete = selectedPlaylist;
        }
        function clearDataFromModal() {
            vm.error = null;
            vm.createError = null;
            vm.newplayList = null;
            vm.inputQuery = null;
            vm.invitationEmail = null;
            vm.emailSuccess = null;
            vm.emailError = null;
            vm.newplayList = null;
            vm.createError = null;
            vm.createSuccess = null;
            vm.selectedPlaylistToDelete = null;

        }

        function closeModal() {
            clearDataFromModal();
            $('.modal').modal('hide');
        }
        function getUserDetails() {
            var promise = UserService.findUserById(vm.userId);
            promise.success (function (result) {
                if (result && result.status==='OK' && result.data) {
                    vm.followers = result.data.followers.length ;
                    vm.following = result.data.following.length ;
                    vm.error = null;
                    vm.favorite = result.data.favPlayList;
                    vm.user = result.data;
                } else {
                    vm.error = "Some Error Occurred!! Please try again!";
                }

            }).error(function () {
                vm.error = "Some Error Occurred!! Please try again!";
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
        function openPlaylist(playlistid) {
            $location.url("/user/playlist/songs/"+ playlistid);
        }

        function deleteplayList() {
            var promise = playListService.deleteplayList(vm.selectedPlaylistToDelete);
            promise.success(function(playList) {
                if(playList){
                    closeModal();
                    init();
                }
            })
            promise.error(function (err) {
                vm.error = "PlayList Not found";
            })
        }

        function createPlayList () {
            vm.newplayList.playListOwner = vm.userId;
            var promise = playListService.createplayList(vm.newplayList);
            promise.success(function (response) {
                if (response && response.status ==='OK') {
                    vm.createSuccess = "Playlist Successfully created!"
                    $timeout(function () {
                        closeModal();
                        init();
                    }, 250);
                }
                else {
                    vm.createError = "Some Error Occurred" ;
                    vm.createSuccess = null;
                }

            }).error(function (err) {
                vm.createSuccess = null;
                vm.createError = "Some Error Occurred" ;
            })
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

        function findAllPlayList() {
            var promise = UserService.findAllplayList(vm.userId);
            promise.success(function (response) {

                if (response && response.status ==='OK') {
                    vm.playLists = response.data;
                    vm.error = null;
                }
                else {
                    vm.playLists = null;
                    if (response.description) {
                        vm.error = response.description;
                    }
                    else {
                        vm.error = "Some Error Occurred" ;
                    }

                }

            }).error(function (err) {
                vm.error = "Some Error Occurred" ;
            })
        }

    }
})();