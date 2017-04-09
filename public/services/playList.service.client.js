/**
 * Created by sumitbhanwala on 4/9/17.
 */
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
        .factory("playListService" ,playListService)

    function playListService($http) {
        var api = {
            "createplayList" : createplayList,
            "findAllSongs" : findAllSongs ,
            "deleteplayList" : deleteplayList
        }
        return api;

        function findAllSongs(playListId) {
            console.log("playList id is" + playListId);
            return $http.get("/api/user/playList/song/"+playListId);
        }

        function createplayList(playList) {
            console.log("playList is" + playList);
            return $http.post("/api/playList", playList);
        }

        function deleteplayList (playList) {
            console.log("insid the delete part on the clinet side");
            return $http.delete("/api/playList/"+playList._id);
        }

    }
})();