/**
 * Created by sumitbhanwala on 4/9/17.
 */
// creating a user service which will be invoked when a user hits on the login page with the valid
// credentials and if the username and password are correct than lets the user go to the profile
// page of his and all the fields of the profile populated with his credentials
(function () {
    angular
        .module("WebDevMusicApp")
        .factory("playListService" ,playListService)

    function playListService($http) {
        var api = {
            "createplayList" : createplayList,
            "findAllSongs" : findAllSongs ,
            "deleteplayList" : deleteplayList ,
            "addSongtoPlayList": addSongtoPlayList,
            "deleteSongFromPlayList" :deleteSongFromPlayList,
            "createSongFromSpotify" : createSongFromSpotify,
            "checkSongInPlayList" : checkSongInPlayList,
            "createSong" : createSong
        }
        return api;

        function createSong(song) {
            return $http.post("/api/playList/createSong/", song);
        }

        function checkSongInPlayList(favorite,songId) {
            return $http.get("/api/playList/songpresent/"+ favorite + "/"+songId);
        }
        function findAllSongs(playListId) {
            console.log("playList id is" + playListId);
            return $http.get("/api/user/playList/song/"+playListId);
        }

        function deleteSongFromPlayList(playListId ,songId) {
            return $http.delete("/api/user/playlist/song/"+playListId +"/" +songId);
        }

        function addSongtoPlayList(songid ,pid) {

            return $http.get("/api/playList/new/"+songid+"/" +pid);
        }

        function createplayList(playList) {
            console.log("playList is" + playList);
            return $http.post("/api/playList", playList);
        }


        function createSongFromSpotify(newSong,playlistId) {
            console.log("Song is" + newSong);
            return $http.post("/api/playList/createNewSong/" + playlistId, newSong);
        }

        function deleteplayList (playList) {
            console.log("inside the delete part on the clinet side");
            return $http.delete("/api/playList/"+playList._id);
        }
       /* function addSongToFavorite(newSong,playlistId) {
            return $http.post("/api/playList/createSongInFavorite/" + playlistId, newSong);
        }*/

    }
})();