/**
 * Created by sumitbhanwala on 4/12/17.
 */
(function() {
    angular
        .module("WebDevMusicApp")
        .controller("FollowerController", FollowerController);

    function FollowerController ($location ,$routeParams ,UserService ,Upload) {
        var vm = this;
        vm.userId = $routeParams['uid'];
        vm.followers = null;
        vm.following = null;
        vm.followersLength=null;
        vm.searchUsers = searchUsers ;
        vm.clearUserFromModal  = clearUserFromModal;
        vm.redirectToSearchedUser  = redirectToSearchedUser;
        function init() {
            getUserDetails();
            var promise = UserService.findFollowersById(vm.userId);
            promise.success (function (result) {
                if (result && result.status==='OK' && result.data && result.data.length >0) {
                    vm.followers = result.data;
                    vm.error = null;
                } else {
                    vm.followers = null;
                    vm.error = "You have no followers ";
                }
            }).error(function () {
                vm.followers = null;
                vm.error = "Some Error Occurred!! Please try again!";
            });

        }
        init();
        function closeModal() {

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
                    vm.followersLength = result.data.followers.length ;
                    vm.following = result.data.following.length ;
                    vm.error = null;
                } else {
                    vm.error = "Some Error Occurred!! Please try again!";
                }

            }).error(function () {
                vm.error = "Some Error Occurred!! Please try again!";
            });
        }
        function clearUserFromModal() {
            vm.users = null;
            vm.error = null;
            vm.inputQuery = null;
        }

    }
})();