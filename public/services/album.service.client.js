/**
 * Created by sumitbhanwala on 4/6/17.
 */
/**
 * Created by sumitbhanwala on 4/4/17.
 */
/**
 * Created by sumitbhanwala on 2/14/17.
 */
// creating a user service which will be invoked when a user hits on the login page with the valid
// credentials and if the username and password are correct than lets the user go to the profile
// page of his and all the fields of the profile populated with his credentials
(function () {
    angular
        .module("WebDevMusicApp")
        .factory("albumService" ,albumService)

    function albumService($http) {
        var api = {
            "createalbum" : createalbum,
            "findAllSongs" : findAllSongs ,
            "deleteAlbum" : deleteAlbum,
            "deleteSongFromAlbum" : deleteSongFromAlbum
        }
        return api;


        function findAllSongs(albumId) {
            console.log("Album id is" + albumId);
            return $http.get("/api/user/album/song/"+albumId);

        }

        function deleteSongFromAlbum(albumId ,songId) {
            console.log("Album id is" + albumId);
            console.log("Song id is" + songId);
            return $http.delete("/api/user/album/song/"+albumId +"/" +songId);
        }

        function createalbum(album) {
            console.log("album is" + album);
            return $http.post("/api/album", album);
        }

        function deleteAlbum (album) {
            console.log("insid the delete part on the clinet side");
            return $http.delete("/api/album/"+album._id);
        }

    }
})();