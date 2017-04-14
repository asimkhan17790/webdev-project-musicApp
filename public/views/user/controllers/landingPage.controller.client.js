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
        vm.error=null;
        vm.errorLogin = null;
        vm.clearUserFromModal = clearUserFromModal;
        vm.openSignupModalFromLoginModal = openSignupModalFromLoginModal;
        function init() {
            //StaticDataService
            vm.user={};
            vm.userType =  vm.userOptions[0];
        }
        init();

        function openSignupModalFromLoginModal() {
            vm.user=null;
            vm.error = null;
            vm.errorLogin = null;
            $('.modal').modal('hide');
            $('#myModalSignup').modal('show');

        }
        function closeModal() {
            vm.user=null;
            vm.error = null;
            vm.errorLogin = null;
            $('.modal').modal('hide');
        }

        function redirectToForgotPassword() {
            closeModal();
            $timeout(function () {
                 $location.url("/landingPage/forgetpass");
            }, 250);
        }

        function clearUserFromModal() {
            vm.user = null;
            vm.error = null;
            vm.errorLogin = null;
        }
        function login(userId, password) {
            var promise = UserService.findUserByCredentials(userId, password);
            promise.success(function(response) {
                if (response && response.status==='OK') {
                    vm.errorLogin = null;
                    if (response.user) {
                        closeModal();
                        $timeout(function () {
                            if(response.user.userType === "M")
                            {
                                $location.url("/user/userHomePageSinger/"+response.user._id);
                            }
                            else if(response.user.userType === "U") {
                                $location.url("/user/userHomePage/" + response.user._id);
                            }
                            else if(response.user.userType === "E") {
                                $location.url("/user/userHomeEventOrg/" + response.user._id);
                            }
                            else if(response.user.userType === "A"){
                                $location.url("/user/adminHomePage/" + response.user._id);
                            }
                            else
                            {
                                $location.url("/");
                            }
                        }, 350);
                    }

                }else {
                    if (response.description) {
                        vm.errorLogin = response.description;
                    }
                    else {
                        vm.errorLogin = "Some Error Occurred! Please Try again.";
                    }

                }

            }).error(function (err) {

                if (err.description) {
                    vm.errorLogin = err.description;
                }
                else {
                    vm.errorLogin = "Some Error Occurred! Please Try again.";
                }

            })
        }

        function createUser() {
            vm.user.userType = vm.userType.userType;
            var promise = UserService.createUser(vm.user);
            promise.success(function (response) {
                    //console.log(response.user);
                    if (response.status && response.status==='OK') {
                        if(response.user){
                            closeModal();
                            $timeout(function () {
                                if(response.user.userType === "M")
                                {
                                    $location.url("/user/userHomePageSinger/" + response.user._id);
                                }
                                // remaining are for the different type of users which I currently dont care and
                                // later for the admin too
                                else if(response.user.userType == "U") {
                                    $location.url("/user/userHomePage/" + response.user._id);
                                }
                                else if(response.user.userType === "E") {
                                    $location.url("/user/userHomeEventOrg/" + response.user._id);
                                }
                                else {
                                    //todo
                                }
                                // $location.url("/user/forgotPassword");

                            }, 250);
                        } else {
                            vm.error = "Some Error Occurred!! Please try again.";
                        }
                    }
                    else {
                        if (response.description) {
                            vm.error = response.description;
                        } else {
                            vm.error = "Some Error Occurred!! Please try again.";
                        }

                    }

                }
            ).error(function (err) {
                if (err && err.description) {
                    vm.error = err.description;
                }
                else {
                    vm.error = "Some Error Occurred!!"
                }
            })
        }
    }

})();