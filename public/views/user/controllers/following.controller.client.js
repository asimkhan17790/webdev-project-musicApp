/**
 * Created by sumitbhanwala on 4/12/17.
 */
(function() {
    angular
        .module("WebDevMusicApp")
        .controller("FollowingController", FollowingController);

    function FollowingController ($location ,$routeParams ,UserService ,Upload) {
        var vm = this;
        vm.userId = $routeParams['uid'];
        vm.following = null;
        vm.error = null ;
        function init() {
            var promise = UserService.findFollowingById(vm.userId);
            promise.success (function (result) {
                if (result && result.status==='OK' && result.data && result.data.length >0) {
                    vm.following = result.data;
                    vm.error = null;
                } else {
                    vm.following = null;
                    vm.error = "You are not following anyone currently";
                }
            }).error(function () {
                vm.following = null;
                vm.error = "Some Error Occurred!! Please try again!";
            });

        }
        init();
    }
})();