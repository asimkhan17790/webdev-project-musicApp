/**
 * Created by Asim on 30-03-2017.
 */
(function() {

    angular
        .module("WebDevMusicApp")
        .controller("AllPlayListController",PlayListController);


    function PlayListController($location,Upload,$timeout,MusicService,$sce,EmailService,$scope) {

        var vm = this;
        vm.openPlaylist = openPlaylist;

        vm.playlists = [

            {
              name:"Playlist1",
              createdOn:Date.now(),
              songs:11,
              playlistThumbNail:"../../../resources/images/MuiscAlt2.png"
            },
            {
                name:"Playlist2",
                createdOn:Date.now(),
                songs:1,
                playlistThumbNail:"../../../resources/images/MuiscAlt2.png"
            },
            {
                name:"Playlist3",
                createdOn:Date.now(),
                songs:100,
                playlistThumbNail:"../../../resources/images/MuiscAlt2.png"
            },
            {
                name:"Playlist4",
                createdOn:Date.now(),
                songs:134,
                playlistThumbNail:"../../../resources/images/MuiscAlt2.png"
            },
            {
                name:"Playlist5",
                createdOn:Date.now(),
                songs:112,
                playlistThumbNail:"../../../resources/images/MuiscAlt2.png"
            }
        ];
        function init() {

        }
        init();

        function openPlaylist(_id) {

        }
    }
})();