/**
 * Created by Asim on 30-03-2017.
 */
(function() {

    angular
        .module("WebDevMusicApp")
        .controller("AllPlayListController",PlayListController);


    function PlayListController($location,$timeout,$sce,UserService,$routeParams,playListService) {

        var vm = this;

        vm.userId = $routeParams['uid'];
        vm.error = null;
        vm.createError = null;
        vm.closeModal = closeModal;
        vm.clearDataFromModal = clearDataFromModal;
        vm.newplayList = null;
        vm.createPlayList = createPlayList;
        vm.openPlaylist = openPlaylist
        vm.deleteplayList = deleteplayList ;
        function init() {
            findAllPlayList();
        }
        init();
        function clearDataFromModal() {
            vm.error = null;
            vm.createError = null;
            vm.newplayList = null;
        }
        function closeModal() {
            vm.newplayList = null;
            vm.createError = null;
            vm.createSuccess = null;
            vm.error = null;
            $('.modal').modal('hide');
        }
        
        function openPlaylist(playlistid) {
            $location.url("/user/playlist/songs/" + playlistid);
        }
        function deleteplayList(playList) {
            var promise = playListService.deleteplayList(playList);
            promise.success(function(playList) {
                if(playList){
                    init();
                }
            })
            promise.error(function (err) {
                vm.error = "PlayList Not found";
            })
        }

        function createPlayList () {
            vm.newplayList.playListOwner = vm.userId;
            var promise = playListService.createplayList(vm.newplayList);
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

        function findAllPlayList() {
            var promise = UserService.findAllplayList(vm.userId);
            promise.success(function (response) {

                if (response && response.status ==='OK') {
                    vm.playLists = response.data;
                    vm.error = null;
                }
                else {
                    vm.playLists = null;
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