(function() {

    angular
        .module("WebDevMusicApp")
        .controller("LandingPageController",LandingPageController);

    function LandingPageController ($location, UserService ,$routeParams,StaticDataService) {
        var vm = this;
        vm.login = login;
        vm.createUser = createUser;
        vm.userOptions = StaticDataService.userTypeOptions;

        function init() {
            //StaticDataService
            vm.user={};
            vm.userType =  vm.userOptions[2];
        }
        init();

        function login(userId, password) {
            console.log("username is" +userId)
            console.log("password is" +password)
            var promise = UserService.findUserByCredentials(userId, password);
            promise.success(function(user) {
                if(user)
                    console.log(user);
                else
                    vm.error = "User Not found";
            })
            promise.error(function (user) {
                vm.error = "User Not found";
            })
        }

        function createUser() {

            vm.user.userType = vm.userType.userType;
            var promise = UserService.createUser(vm.user);

            promise.success(function (user) {
                console.log(user);
                }
            ).error(function (err) {
                console.log(err);
            })

        }

    }

})();