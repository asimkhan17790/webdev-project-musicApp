(function() {

    angular
        .module("WebDevMusicApp")
        .run(function($rootScope, $uibModalStack) {
        $uibModalStack.dismissAll();
    })
    .controller("HomePageController",HomePageController);

    function HomePageController ($scope) {

        var vm = this;


        function init() {
           /* $(document).ready(function () {
                $('[data-toggle="offcanvas"]').click(function () {
                    $('.row-offcanvas').toggleClass('active');
                    $scope.$apply();
                });
            });*/
        }
        init();

    }

})();