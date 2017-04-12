(function() {

    angular
        .module("WebDevMusicApp")
        .controller("UserProfileController",UserProfileController);

    function UserProfileController ($location, UserService ,$routeParams,StaticDataService ,$timeout) {

        var vm = this;
        var userId = $routeParams.uidS ;
        var pid = $routeParams.uidP;
        vm.followUser = followUser;
        vm.unfollowUser = unfollowUser;
        vm.findPlayList = findPlayList;
        function init() {
            getUserDetails();
            getfollowing();
            findPlayList();
        }
        init();

        function getUserDetails() {
            var promise = UserService.findUserById(userId);
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
            var promise = UserService.isFollowing(userId ,pid);
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
             UserService.followUser(userId ,pid);
             init();
         }

        function unfollowUser() {
            UserService.unfollowUser(userId ,pid);
            init();
        }
        findPlayList()

        // pid is the person whom we wanna show the playlist of the userID
        // so we check if in pid is following  userID.
        function findPlayList() {
            var promise = UserService.findAllplayListAndFollowing(userId ,pid);
            promise.success (function (result) {
                if (result && result.status==='OK' && result.data) {
                    vm.playlists = result.data;
                } else {
                    vm.error = "Some Error Occurred!! Please try again!";
                }

            }).error(function () {
                vm.error = "Some Error Occurred!! Please try again!";
            });
        }

    }

})();