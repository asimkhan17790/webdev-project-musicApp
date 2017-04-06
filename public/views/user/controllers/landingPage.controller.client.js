(function() {

    angular
        .module("WebDevMusicApp")
        /*.run(function($rootScope, $uibModalStack) {
            $uibModalStack.dismissAll();
        })*/
        /*.run([
            '$rootScope','$uibModalStack','$timeout',
            function ($rootScope, $uibModalStack, $timeout) {
                $rootScope.$on('$locationChangeStart', function (event) {
                    var top = $uibModalStack.getTop();
                    if (top) {
                        $uibModalStack.dismiss(top.key);
                        event.preventDefault();
                    }
                    $uibModalStack.dismissAll();

                    $timeout(function () {
                        $('.modal').modal('hide');
                    }, 15);
                    console.log('bye');
                });
            }
        ])*/
        .controller("LandingPageController",LandingPageController);

    function LandingPageController ($location,$timeout) {

        var vm = this;
        vm.closeModal = closeModal;
        vm.redirectToForgotPassword = redirectToForgotPassword;
        vm.signInUser = signInUser;
        function init() {
        }
        init();

        function closeModal() {
            console.log(vm);

            //$scope.$apply();
        }


        function redirectToForgotPassword() {
            $('.modal').modal('hide');

            $timeout(function () {
                $location.url("/user/forgotPassword");
            }, 250);
        }

        function signInUser () {
            $timeout(function () {
                $location.url("/user/userHomePage");
            }, 250);
        }


    }

})();