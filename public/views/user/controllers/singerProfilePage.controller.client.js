(function() {

    angular
        .module("WebDevMusicApp")
        .controller("SingerProfileController",SingerProfileController);

    function SingerProfileController ($location, UserService ,$routeParams,StaticDataService ,$timeout ,currentUser) {
        var vm = this;
        vm.userId = $routeParams.uidS ;
        vm.pid = currentUser._id;
        vm.redirectToSearchedUser  = redirectToSearchedUser;
        vm.searchUsers = searchUsers;
        vm.notFollowing = null;
        vm.openAlbum = openAlbum ;
        vm.logout = logout ;
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
                            $location.url("/user/userSearch/"+vm.pid+"/"+userId2);
                        else if(searchedUser.userType == 'M')
                        {
                            $location.url("/user/singerSearch/"+vm.pid+"/"+userId2);
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