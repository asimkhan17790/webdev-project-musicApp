(function() {

    angular
        .module("WebDevMusicApp")
        .run(function($rootScope, $uibModalStack) {
            $uibModalStack.dismissAll();
        })
        .controller("HomePageSingerController",HomePageSingerController);

    function HomePageSingerController ($location, albumService ,$routeParams,StaticDataService ,$timeout) {
        var vm = this;
        vm.createalbum = createalbum ;
        function init() {
            $(document).ready(function () {
                $('[data-toggle="offcanvas"]').click(function () {
                    $('.row-offcanvas').toggleClass('active');
                    $scope.$apply();
                });
            });
        }
        init();

        function createalbum() {
            var promise = albumService.createUser(vm.album);
            promise.success(function (album) {
                    console.log(album);
                }
            ).error(function (err) {
                console.log(err);
            })
        }
    }

})();