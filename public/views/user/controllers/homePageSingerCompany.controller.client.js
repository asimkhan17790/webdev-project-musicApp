(function() {
    angular
        .module("WebDevMusicApp")
        .run(function($rootScope, $uibModalStack) {
            $uibModalStack.dismissAll();
        })
        .controller("HomePageSingerController",HomePageSingerController);

    function HomePageSingerController ($scope ,$location,UserService,MusicService, albumService ,$routeParams,StaticDataService ,$timeout) {
        var vm = this;
        vm.userId = $routeParams.uid ;
        vm.deleteAlbum = deleteAlbum ;
        // function init() {
        //     var promise = UserService.findAllAlbums(vm.userId);
        //     promise.success(function (user) {
        //       //  console.log(user);
        //         vm.albums = user.album ;
        //     })
        //     promise.error(function (err) {
        //         console.log("some error occured " + err);
        //         vm.albums = null ;
        //     })
        // }
        function init() {
           // searchNearByEvents();
           // searchAllPlaylists();
            getUserDetails ();
            getMusicUpdates();
        }
        init();

        function closeModal() {
            $('.modal').modal('hide');
        }

        function getUserDetails() {
            var promise = UserService.findUserById(vm.userId);
            promise.success (function (result) {
                if (result && result.status==='OK' && result.data) {
                    vm.user = result.data;
                    vm.error = null;
                } else {
                    vm.error = "Some Error Occurred!! Please try again!";
                }

            }).error(function () {
                    vm.error = "Some Error Occurred!! Please try again!";
                });
        }

        function closeModal() {
            $('.modal').modal('hide');
        }

        function getMusicUpdates() {
            var promise = MusicService.getMusicUpdates();
            promise.success(function (response) {

                if (response.status=='ok') {
                    vm.musicArticles = response.articles;
                    console.log(vm.musicArticles);
                  //  geenerateNewsWidget();
                }else {
                    vm.musicArticles = null;
                }
            }).error(function (err) {
                vm.musicArticles = null;
            });
        }

        function deleteAlbum(album) {
            var promise = albumService.deleteAlbum(album);
            promise.success(function(album) {
                if(album){
                    init();
                }
            })
            promise.error(function (err) {
                vm.error = "Album Not found";
            })
        }

        // recently added code check this end to end clearly and maybe this should go in the init block
        // check if the albums are listed correctly or not
        function createalbum() {
            vm.album.albumOwner =  vm.userId;
            var promise = albumService.createalbum(vm.album);
            promise.success(function(album) {
                if(album){
                    closeModal();
                    vm.album = {};
                    $timeout(function () {
                    // probably will handle the redirection to the
                     // album default page
                        init();
                    }, 250);
                }
            })
            promise.error(function (err) {
                vm.error = "User Not found";
            })
        }

        function getTrsustedURL (url) {
           return  $sce.trustAsResourceUrl(url);
        }
    }

})();