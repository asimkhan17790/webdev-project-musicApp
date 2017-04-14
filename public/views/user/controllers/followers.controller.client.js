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
        vm.searchUsers = searchUsers ;
        vm.clearUserFromModal  = clearUserFromModal;
        function init() {
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
        function clearUserFromModal() {
            vm.users = null;
            vm.error = null;
            vm.inputQuery = null;
        }

    }
})();