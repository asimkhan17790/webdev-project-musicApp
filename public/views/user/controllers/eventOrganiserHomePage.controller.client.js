(function() {

    angular
        .module("WebDevMusicApp")
        .controller("EventOrgController",EventOrgController);

    function EventOrgController ($location, UserService ,$routeParams,StaticDataService ,$timeout) {

        var vm = this;
        vm.userId = $routeParams.uid ;

        function init() {
            console.log('Event Org Page controller');
            getUserDetails ();
        }
        init();

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

    }

})();