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
            $('.carousel').carousel({
                interval: 5000
            }).carousel('cycle');
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
            // maye use the status from passport to display messages
            var promise = UserService.findUserByCredentials(userId, password);
            promise.success(function(response) {
                console.log(response);
                closeModal();
                $timeout(function () {
                    if(response.userType === "U") {
                        $location.url("/user/userHomePage");}
                        else if(response.userType === "E") {
                            $location.url("/user/userHomeEventOrg");}
                    else if(response.userType === "M") {
                        $location.url("/user/userHomePageSinger");}
                    else if(response.userType === "A") {
                        $location.url("/user/adminHomePage");}
                        else
                            $location.url("/");
                }, 350);

            }).error(function (err) {
                console.log(err);
                if (err && err==='Unauthorized') {
                    vm.errorLogin = "Cannot login! Please Check Username and password";
                }else {
                    vm.errorLogin = "Some Error occurred! Please try again.";
                }
            });
        }
        function createUser() {
            vm.user.userType = vm.userType.userType;
            // maye use the status from passport to display messages

            if (vm.user.cnfPassword === vm.user.password) {
                var promise = UserService.createUser(vm.user);
                promise.success(function(response) {
                    console.log(response);
                    if (response && response.status==='KO') {
                        if (response.description) {
                            vm.error = response.description;
                        } else {
                            vm.error = "Some Error Occurred!! Please try again.";
                        }
                    }
                    else if (response) {
                        closeModal();
                        $timeout(function () {
                            if(response.userType === "U") {
                                $location.url("/user/userHomePage");}
                            else if(response.userType === "E") {
                                $location.url("/user/userHomeEventOrg");}
                            else if(response.userType === "M") {
                                $location.url("/user/userHomePageSinger");}
                            else if(response.userType === "A") {
                                $location.url("/user/adminHomePage");}
                            else
                                $location.url("/");
                        }, 350);
                    }
                }).error(function (err) {
                    console.log(err);
                    if (err && err==='"Unauthorized"') {
                        vm.error = "Cannot login! Please Check Username and password";
                    }else {
                        vm.error = "Some Error occurred! Please try again.";
                    }
                });

            }
            else {
                vm.error = "The passwords do not match.Please enter same passwords.";
            }


        }

        // will refactor the error messages in a better way tomorrow or so
        // currently unable to deal with the response and the error.

        //  function login(userId, password) {
        //      // maye use the status from passport to display messages
        //      var promise = UserService.findUserByCredentials(userId, password);
        //      promise.success(function(response) {
        //          if (response && response.status==='OK') {
        //             vm.errorLogin = null;
        //              if (response.user) {
        //                  closeModal();
        //                  $timeout(function () {
        //                      if(response.user.userType === "M")
        //                      {
        //                          $location.url("/user/userHomePageSinger/"+response.user._id);
        //                      }
        //                      else if(response.user.userType === "U") {
        //                         $location.url("/user/userHomePage/" + response.user._id);
        //                     }
        //                     else if(response.user.userType === "E") {
        //                         $location.url("/user/userHomeEventOrg/" + response.user._id);
        //                     }
        //                     else if(response.user.userType === "A"){
        //                         $location.url("/user/adminHomePage/" + response.user._id);
        //                     }
        //                     else
        //                     {
        //                         $location.url("/");
        //                     }
        //                 }, 350);
        //             }
        //         }else if (response && response.status === '401'){
        //             if (response.description) {
        //                 vm.errorLogin = "User Name and password didnt matchecd";
        //             }
        //             else {
        //                 vm.errorLogin = "User Name and password didnt matchec";
        //             }
        //         }
        //
        //     }).error(function (err) {
        //         if (err.description) {
        //             vm.errorLogin = err.description;
        //         }
        //         else {
        //             vm.errorLogin = "Some Error Occurred! Please Try again.";
        //         }
        //     })
        // }

        // function createUser() {
        //     vm.user.userType = vm.userType.userType;
        //     var promise = UserService.createUser(vm.user);
        //     promise.success(function (response) {
        //             //console.log(response.user);
        //             if (response.status && response.status==='OK') {
        //                 if(response.user){
        //                     closeModal();
        //                     $timeout(function () {
        //                         if(response.user.userType === "M")
        //                         {
        //                             $location.url("/user/userHomePageSinger/" + response.user._id);
        //                         }
        //                         // remaining are for the different type of users which I currently dont care and
        //                         // later for the admin too
        //                         else if(response.user.userType == "U") {
        //                             $location.url("/user/userHomePage/" + response.user._id);
        //                         }
        //                         else if(response.user.userType === "E") {
        //                             $location.url("/user/userHomeEventOrg/" + response.user._id);
        //                         }
        //                         else {
        //                             //todo
        //                         }
        //                         // $location.url("/user/forgotPassword");
        //
        //                     }, 250);
        //                 } else {
        //                     vm.error = "Some Error Occurred!! Please try again.";
        //                 }
        //             }
        //             else {
        //                 if (response.description) {
        //                     vm.error = response.description;
        //                 } else {
        //                     vm.error = "Some Error Occurred!! Please try again.";
        //                 }
        //
        //             }
        //
        //         }
        //     ).error(function (err) {
        //         if (err && err.description) {
        //             vm.error = err.description;
        //         }
        //         else {
        //             vm.error = "Some Error Occurred!!"
        //         }
        //     })
        // }
    }

})();