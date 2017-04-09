(function() {
    angular
        .module("WebDevMusicApp")
        .controller("ForgotPasswordController", ForgotPasswordController);

    function ForgotPasswordController ($location) {

        var vm = this;
        vm.sendEmail = sendEmail ;
        function init() {

        }
        init();
        function sendEmail() {
            console.log(vm.emailaddress);
        }
    }
})();