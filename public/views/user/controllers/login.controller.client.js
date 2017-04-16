(function() {

    angular
        .module("WebDevMusicApp")

        .controller("LoginController",loginController);

    function loginController ($location, UserService ,$routeParams,StaticDataService ,$timeout) {

        var vm = this;
        vm.redirectToForgotPassword = redirectToForgotPassword;

        function init() {
        console.log("lets see if logincontroller is calledd");
        }
        init();

        function closeModal() {
            $('.modal').modal('hide');
        }

        function redirectToForgotPassword()
        {
            console.log("inside this function");
            closeModal();
            $timeout(function () {
                $location.url("/landingPage/forgetpass");
            }, 250);
        }

    }

})();