/**
 * Created by sumitbhanwala on 4/2/17.
 */
(function() {

    angular
        .module("WebDevMusicApp")
        .controller("SongsInAlbums",SongsInAlbums);

    function SongsInAlbums($location,Upload,$routeParams,$timeout,MusicService,$sce,EmailService,$scope,albumService) {
        var vm = this;
        vm.userId = $routeParams.uid ;
        vm.albumId = $routeParams.aid;
        vm.sendtoserver = sendtoserver;
        // some part is needed to be done in this module
        // ie. for iterating over the song model
         function init() {
                var promise = albumService.findAllSongs(vm.albumId);
                promise.success(function (album) {
                    //  console.log(user);
                    vm.songs = album.songs ;
                })
                promise.error(function (err) {
                    console.log("some error occured " + err);
                    vm.songs = null ;
                })
            }
        init();

        function closeModal() {
            $('.modal').modal('hide');
        }

        function sendtoserver() {
                Upload.upload({
                    url: '/api/musicCompany/uploadSong', // web api which will handle the data
                    data:{
                        title : vm.song.title,
                        name : vm.song.name,
                        genre : vm.song.genre,
                        userId : vm.userId,
                        albumId : vm.albumId,
                        file:vm.file
                    } //pass file as data, should be user ng-model
                }).then(function (updatedalbum) { //upload function returns a promise
                    closeModal();
                    vm.song = {};
                    $timeout(function () {
                        // probably will handle the redirection to the
                        // album default page
                        init();
                    }, 250);
                }, function (resp) { //catch error
                    console.log(resp);
                });
        }
    }
})();