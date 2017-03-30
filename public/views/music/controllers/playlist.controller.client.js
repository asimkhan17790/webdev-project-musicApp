/**
 * Created by Asim on 30-03-2017.
 */
(function() {

    angular
        .module("WebDevMusicApp")
        .controller("PlayListController",PlayListController);


    function PlayListController($location,Upload,$timeout,MusicService,$sce,EmailService) {

        var vm = this;


        vm.playlist = {
            playlistId:"123456",
            ownerID :"123456789",
            ownerName : "Asim Khan",
            ownerUserName : "asimkhan17",
            songs:[
                {
                    "title": "All This Is - Joe L.'s Studio",
                    "length": "2:46", //?
                    "url": "JLS_ATI" // spotify ID
                },
                {
                    "title": "All This Is - Joe L.'s Studio",
                    "length": "2:46", //?
                    "url": "JLS_ATI" // spotify ID
                },
                {
                    "title": "All This Is - Joe L.'s Studio",
                    "length": "2:46", //?
                    "url": "JLS_ATI" // spotify ID
                },
                {
                    "title": "All This Is - Joe L.'s Studio",
                    "length": "2:46", //?
                    "url": "JLS_ATI" // spotify ID
                },
                {
                    "title": "All This Is - Joe L.'s Studio",
                    "length": "2:46", //?
                    "url": "JLS_ATI" // spotify ID
                },
                {
                    "title": "All This Is - Joe L.'s Studio",
                    "length": "2:46", //?
                    "url": "JLS_ATI" // spotify ID
                },
                {
                    "title": "All This Is - Joe L.'s Studio",
                    "length": "2:46", //?
                    "url": "JLS_ATI" // spotify ID
                },
                {
                    "title": "All This Is - Joe L.'s Studio",
                    "length": "2:46", //?
                    "url": "JLS_ATI" // spotify ID
                },
                {
                    "title": "All This Is - Joe L.'s Studio",
                    "length": "2:46", //?
                    "url": "JLS_ATI" // spotify ID
                },
                {
                    "title": "All This Is - Joe L.'s Studio",
                    "length": "2:46", //?
                    "url": "JLS_ATI" // spotify ID
                },
                {
                    "title": "All This Is - Joe L.'s Studio",
                    "length": "2:46", //?
                    "url": "JLS_ATI" // spotify ID
                },
                {
                    "title": "All This Is - Joe L.'s Studio",
                    "length": "2:46", //?
                    "url": "JLS_ATI" // spotify ID
                },
                {
                    "title": "All This Is - Joe L.'s Studio",
                    "length": "2:46", //?
                    "url": "JLS_ATI" // spotify ID
                },
                {
                    "title": "All This Is - Joe L.'s Studio",
                    "length": "2:46", //?
                    "url": "JLS_ATI" // spotify ID
                },
                {
                    "title": "All This Is - Joe L.'s Studio",
                    "length": "2:46", //?
                    "url": "JLS_ATI" // spotify ID
                },
                {
                    "title": "All This Is - Joe L.'s Studio",
                    "length": "2:46", //?
                    "url": "JLS_ATI" // spotify ID
                },
                {
                    "title": "All This Is - Joe L.'s Studio",
                    "length": "2:46", //?
                    "url": "JLS_ATI" // spotify ID
                },
                {
                    "title": "All This Is - Joe L.'s Studio",
                    "length": "2:46", //?
                    "url": "JLS_ATI" // spotify ID
                },
                {
                    "title": "All This Is - Joe L.'s Studio",
                    "length": "2:46", //?
                    "url": "JLS_ATI" // spotify ID
                },
                {
                    "title": "All This Is - Joe L.'s Studio",
                    "length": "2:46", //?
                    "url": "JLS_ATI" // spotify ID
                },
                {
                    "title": "All This Is - Joe L.'s Studio",
                    "length": "2:46", //?
                    "url": "JLS_ATI" // spotify ID
                }

            ],
            playlistThumbNail : "",



        };



        function init () {
            console.log('playlistController init');
        }
        init();
    }
})();