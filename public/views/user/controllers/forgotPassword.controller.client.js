(function() {
    angular
        .module("WebDevMusicApp")
        .controller("ForgotPasswordController", ForgotPasswordController);

    function ForgotPasswordController ($location,UserService) {

        var vm = this;
        vm.sendEmail = sendEmail;
        vm.errorEmail = null;
        vm.successEmail = null;
        function init() {

        }
        init();
        function sendEmail() {
            var promise = UserService.forgotPasswordEmail(vm.emailAddress);
            promise.success(function(response) {
                if (response && response.status ==='OK') {
                    vm.errorEmail = null;
                    vm.successEmail = "Password Successfully sent to your Registered Email!";

                }else {
                    if (response.description) {
                        vm.errorEmail = response.description;
                        vm.successEmail = null;
                    }
                    else {
                        vm.errorEmail = "Some Error Occurred! Please Try again.";
                        vm.successEmail = null;
                    }
                }
            }).error(function (err) {

                if (err.description) {
                    vm.errorEmail = err.description;
                    vm.successEmail = null;
                }
                else {
                    vm.errorEmail = "Some Error Occurred! Please Try again.";
                    vm.successEmail = null;
                }

            })
        }
    }
})();