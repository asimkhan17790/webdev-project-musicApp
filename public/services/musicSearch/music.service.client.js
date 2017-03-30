(function() {

    angular
        .module("WebDevMusicApp")
        .factory("MusicService",MusicService);

    function MusicService ($http) {


        var api= {

            "searchMusicFingerPrint" : searchMusicFingerPrint,
            "searchLyrics" : searchLyrics
        };

        return api;

        //callback functions


        function searchMusicFingerPrint(musicBlobObject) {

            return $http.post("/api/findmusic/musicFingerPrint",musicBlobObject);
        }

        function searchLyrics(songTitle, artistName) {
            return $http.get("/api/music/lyrics/" + songTitle + "/" + artistName);
        }

    }

})();