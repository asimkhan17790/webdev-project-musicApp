(function() {

    angular
        .module("WebDevMusicApp")
        .factory("MusicService",MusicService);

    function MusicService ($http) {


        var api= {

            "searchMusicFingerPrint":searchMusicFingerPrint
        };

        return api;

        //callback functions


        function searchMusicFingerPrint(musicBlobObject) {

            return $http.post("/api/findmusic/musicFingerPrint",musicBlobObject);
        }
    }

})();