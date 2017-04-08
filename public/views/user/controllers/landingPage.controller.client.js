(function() {

    angular
        .module("WebDevMusicApp")
        .controller("LandingPageController",LandingPageController);

    function LandingPageController ($location, UserService ,$routeParams,StaticDataService ,$timeout) {
        var vm = this;
        vm.login = login;
        vm.createUser = createUser;
        vm.userOptions = StaticDataService.userTypeOptions;
        vm.closeModal = closeModal;
        vm.redirectToForgotPassword = redirectToForgotPassword;

        function init() {
            //StaticDataService
            vm.user={};
            vm.userType =  vm.userOptions[2];
        }
        init();

        function closeModal() {
            $('.modal').modal('hide');
        }


        function redirectToForgotPassword() {
            $('.modal').modal('hide');

        }

      /*  function signInUser () {
            $timeout(function () {
                $location.url("/user/userHomePage");
            }, 250);
        }
*/
        function login(userId, password) {
            var promise = UserService.findUserByCredentials(userId, password);
            promise.success(function(user) {
                if(user){
                    closeModal();
                    $timeout(function () {
                        if(user.userType == "M")
                        {
                            $location.url("/user/userHomePageSinger/"+user._id);
                        }
                        // remaining are for the different type of users which I currently dont care
                        else if(user.userType == "U")
                            $location.url("/user/forgotPassword");
                        else
                            $location.url("/user/forgotPassword");

                    }, 250);
                }
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