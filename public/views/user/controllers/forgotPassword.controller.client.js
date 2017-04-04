(function() {

    angular
        .module("WebDevMusicApp")
        /*.run([
            '$rootScope','$uibModalStack','$timeout',
            function ($rootScope, $uibModalStack, $timeout) {
                $rootScope.$on('$locationChangeStart', function (event) {
                    var top = $uibModalStack.getTop();
                    if (top) {
                        $uibModalStack.dismiss(top.key);
                        event.preventDefault();

                    }

                    $timeout(function () {
                        $('.modal').modal('hide');
                    }, 15);
                    console.log('bye');
                });
            }
        ])*/
        .controller("ForgotPasswordController", ForgotPasswordController);

    function ForgotPasswordController ($location) {

        var vm = this;
        function init() {
            console.log('Forgot password controller started');
            console.log('Forgot password controller started' +vm.username);
            $('.modal').modal('hide');
        }
        init();
    }

})();