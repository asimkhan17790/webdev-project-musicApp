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
    }
})();