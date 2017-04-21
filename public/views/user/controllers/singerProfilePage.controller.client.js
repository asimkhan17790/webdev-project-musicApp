(function() {

    angular
        .module("WebDevMusicApp")
        .controller("SingerProfileController",SingerProfileController);

    function SingerProfileController ($location, MusicService ,playListService ,UserService ,$routeParams,StaticDataService ,$timeout ,currentUser) {
        var vm = this;
        vm.userId = $routeParams.uidS ;
        vm.pid = currentUser._id;
        vm.redirectToSearchedUser  = redirectToSearchedUser;
        vm.searchUsers = searchUsers;
        vm.notFollowing = null;
        vm.openAlbum = openAlbum ;
        vm.logout = logout ;
        vm.songError = null;
        vm.searchSongs = searchSongs ;
        vm.redirectToSearchedSong = redirectToSearchedSong ;
        vm.getSpotifySong = getSpotifySong ;
        function init() {
            getUserDetails();
            findAllAlbums();
        }
        init();
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

        function logout() {
            UserService
                .logout()
                .then(function () {
                    $location.url('/landingPage');
                });
        }

        function openAlbum(albumId) {
            $location.url("/user/singer/album/songs/" + vm.userId+"/" + albumId);
        }

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


        function getUserDetails() {
            var promise = UserService.findUserById(vm.userId);
            promise.success (function (result) {
                if (result && result.status==='OK' && result.data) {
                    vm.user = result.data;
                    vm.error = null;
                } else {
                    vm.error = "Some Error Occurred!! Please try again!";
                }

            }).error(function () {
                vm.error = "Some Error Occurred!! Please try again!";
            });
        }
        function closeModal() {

            $('.modal').modal('hide');
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

        function findAllAlbums() {
            var promise = UserService.findAllAlbums(vm.userId);
            promise.success (function (result) {
                if (result && result.status==='OK' && result.data != null) {
                    vm.albums = result.data ;
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

})();