(function() {
    angular
        .module("WebDevMusicApp")
        .run(function($rootScope, $uibModalStack) {
            $uibModalStack.dismissAll();
        })
        .controller("HomePageSingerController",HomePageSingerController);

    function HomePageSingerController ($scope ,$location,UserService, albumService ,$routeParams,StaticDataService ,$timeout) {
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

        // recently added code check this end to end clearly and maybe this should go in the init block
        vm.userId = $routeParams.uid ;
      // //  var promise = UserService.findAllAlbums(vm.userId);
      //   promise.success(function (albums) {
      //       vm.albums = albums ;
      //   })
      //   promise.error(function (albums) {
      //       vm.albums = null ;
      //   })

        // check if the albums are listed correctly or not

        function createalbum() {
            vm.album.albumOwner =  vm.userId;
            var promise = albumService.createalbum(vm.album);
            promise.success(function (album) {
                    console.log(album);
                }
            ).error(function (err) {
                console.log(err);
            })
        }
    }

})();