(function() {

    angular
        .module("WebDevMusicApp")
        .factory("MusicService",MusicService);

    function MusicService ($http) {


        var api= {

            "searchMusicFingerPrint" : searchMusicFingerPrint,
            "searchLyrics" : searchLyrics,
            "getMusicUpdates" : getMusicUpdates,
            "searchSongs" : searchSongs,
            "findSongById" : findSongById
        };

        return api;

        //callback functions

        function findSongById(songid) {
            return $http.get("/api/music/findasong/" + songid);
        }

        function searchSongs(inputQuery) {
            return $http.get("/api/music/searchSongs/" + inputQuery);
        }

        function searchMusicFingerPrint(musicBlobObject) {

            return $http.post("/api/findmusic/musicFingerPrint",musicBlobObject);
        }

        function searchLyrics(songTitle, artistName) {
            return $http.get("/api/music/lyrics/" + songTitle + "/" + artistName);
        }

        function getMusicUpdates () {
            return $http.get("/api/music/musicNews");
        }

    }

})();