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
        vm.followUserThisPlayList = followUserThisPlayList;
        vm.notFollowing = null;
        function init() {
            getUserDetails();
            getfollowing();
            findPlayList();
        }
        init();

        function followUserThisPlayList (playList) {
            $location.url("/user/userSearch/playList/songs/"+ playList._id);
            console.log(playList);
        }

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
             vm.playlists = null;
            var promise =  UserService.followUser(userId ,pid);
             promise.success (function (user) {
                init();
             }).error(function () {
                 vm.error = "Some Error Occurred!! Please try again!";
             });
         }

        function unfollowUser() {
            vm.playlists=null;
           var promise = UserService.unfollowUser(userId ,pid);
            promise.success (function (user) {
                init();
            }).error(function () {
                vm.error = "Some Error Occurred!! Please try again!";
            });
        }
        // pid is the person whom we wanna show the playlist of the userID
        // so we check if in pid is following  userID.
        function findPlayList() {
            var promise = UserService.findAllplayListAndFollowing(userId ,pid);
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

})();