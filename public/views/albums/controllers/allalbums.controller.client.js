/**
 * Created by Asim on 30-03-2017.
 */
(function() {

    angular
        .module("WebDevMusicApp")
        .controller("AllAlbumListController",AllAlbumListController);

    function AllAlbumListController($location,currentUser,$timeout,$sce,UserService,$routeParams,playListService,albumService) {

        var vm = this;
        vm.userId = currentUser._id ;
        vm.error = null;
        vm.createError = null;
        vm.closeModal = closeModal;
        vm.clearDataFromModal = clearDataFromModal;
        vm.newAlbum = null;
        vm.openAlbum = openAlbum;
        vm.createAlbum = createAlbum;
        vm.deletethisAlbum = deletethisAlbum ;
        vm.selectAlbumToDelete = selectAlbumToDelete;
        function init() {
            getUserDetails();
            findAllAlbums();

        }

        init();
        function selectAlbumToDelete (album) {
            vm.albumToDelete = album;
        }

        function getUserDetails() {
            var promise = UserService.findUserById(vm.userId);
            promise.success (function (result) {
                if (result && result.status==='OK' && result.data) {
                    vm.followers = result.data.followers.length ;
                    vm.following = result.data.following.length ;
                    vm.error = null;
                    vm.favorite = result.data.favPlayList;
                    vm.user = result.data;
                } else {
                    vm.error = "Some Error Occurred!! Please try again!";
                }

            }).error(function () {
                vm.error = "Some Error Occurred!! Please try again!";
            });
        }
        function clearDataFromModal() {
            vm.error = null;
            vm.createError = null;
            vm.newAlbum = null;
            vm.albumToDelete = null;
        }

        function openAlbum(albumId) {
            $location.url("/user/singer/album/songs/"+ albumId)
        }

        function deletethisAlbum () {
            var promise = albumService.deleteAlbum(vm.albumToDelete);
            promise.success(function (response) {
                if (response && response.status ==='OK') {
                    vm.createSuccess = "Album deleted successfully!";
                    init();
                    $timeout(function () {
                        closeModal();
                    }, 250);
                }
                else {
                    vm.error = "Some Error Occurred during deletion" ;
                    vm.createSuccess = null;
                }
            }).error(function (err) {
                vm.createSuccess = null;
                vm.error = "Some Error Occurred during deletion" ;
            })
        }

        function closeModal() {
            vm.newAlbum = null;
            vm.createError = null;
            vm.createSuccess = null;
            vm.error = null;
            vm.albumToDelete=null;
            $('.modal').modal('hide');
        }

        function createAlbum () {
            vm.newAlbum.albumOwner = vm.userId;
            var promise = albumService.createalbum(vm.newAlbum);
            promise.success(function (response) {
                if (response && response.status ==='OK') {
                    vm.createSuccess = "Playlist Successfully created!"
                    $timeout(function () {
                        closeModal();
                        init();
                    }, 250);
                }
                else {
                    vm.createError = "Some Error Occurred" ;
                    vm.createSuccess = null;
                }

            }).error(function (err) {
                vm.createSuccess = null;
                vm.createError = "Some Error Occurred" ;
            })
        }


        function findAllAlbums() {
            var promise = UserService.findAllAlbums(vm.userId);
            promise.success(function (response) {
                if (response && response.status ==='OK') {
                    vm.albums = response.data;
                    vm.error = null;
                }
                else {
                    vm.albums = null;
                    if (response.description) {
                        vm.error = response.description;
                    }
                    else {
                        vm.error = "Some Error Occurred" ;
                    }
                }

            }).error(function (err) {
                vm.error = "Some Error Occurred" ;
            })
        }

    }
})();