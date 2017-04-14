(function() {

    angular
        .module("WebDevMusicApp")
        .controller("SingerProfileController",SingerProfileController);

    function SingerProfileController ($location, UserService ,$routeParams,StaticDataService ,$timeout) {

        var vm = this;
        // where userId is the id of this singer
        var userId = $routeParams.uidS ;
        // where pid is the id of the person who searched for this user.
        var pid = $routeParams.uidP;
      //  vm.followUser = followUser;
      //  vm.unfollowUser = unfollowUser;
      //  vm.findPlayList = findPlayList;
     //   vm.followUserThisPlayList = followUserThisPlayList;
        vm.notFollowing = null;
        vm.openAlbum = openAlbum ;
        function init() {
            getUserDetails();
            findAllAlbums();
        }
        init();


        function openAlbum(albumId) {
            $location.url("/user/singer/album/songs/" + pid + "/"+userId+"/" + albumId);
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
        // function getfollowing() {
        //     var promise = UserService.isFollowing(userId ,pid);
        //     promise.success (function (result) {
        //         if (result && result.status==='OK' && result.data) {
        //             vm.isFollowing = result.data;
        //         } else {
        //             vm.error = "Some Error Occurred!! Please try again!";
        //         }
        //
        //     }).error(function () {
        //         vm.error = "Some Error Occurred!! Please try again!";
        //     });
        // }

        // function followUser() {
        //     vm.playlists = null;
        //     var promise =  UserService.followUser(userId ,pid);
        //     promise.success (function (user) {
        //         init();
        //     }).error(function () {
        //         vm.error = "Some Error Occurred!! Please try again!";
        //     });
        // }

        // function unfollowUser() {
        //     vm.playlists=null;
        //     var promise = UserService.unfollowUser(userId ,pid);
        //     promise.success (function (user) {
        //         init();
        //     }).error(function () {
        //         vm.error = "Some Error Occurred!! Please try again!";
        //     });
        // }
        // pid is the person whom we wanna show the playlist of the userID
        // so we check if in pid is following  userID.
        function findAllAlbums() {
            var promise = UserService.findAllAlbums(userId);
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