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
        .factory("UserService" ,userService)

    function userService($http) {
        var api = {
            "createUser" : createUser,
            "findUserByCredentials" : findUserByCredentials,
            "updateUser" : updateUser,
            "deleteUser" : deleteUser,
            "findAllAlbums" : findAllAlbums,
            "findAllplayList" : findAllplayList ,
            "findUserById" : findUserById,
            "forgotPasswordEmail" : forgotPasswordEmail,
            "searchUsers" : searchUsers,
            "findFollowersById":findFollowersById,
            "findFollowingById":findFollowingById,
            "isFollowing" : isFollowing,
            "followUser": followUser,
            "unfollowUser" :unfollowUser,
            "searchNonAdminUsers" : searchNonAdminUsers ,
            "findAllplayListAndFollowing":findAllplayListAndFollowing ,
            "loggedin" : loggedin ,
            "logout" : logout ,
            "isAdmin" : isAdmin ,
            "googleLogin" : googleLogin
        }
        return api;

        function loggedin() {
            return $http.post('/api/user/loggedin')
                .then(function (response) {
                    return response.data;
                });
        }

        function googleLogin() {
            return $http.get("/auth/google");
        }

        function isAdmin() {
            return $http.post('/api/user/isAdmin')
                .then(function (response) {
                    return response.data;
                });
        }

        function logout() {
            return $http.post('/api/user/logout')
                .then(function (response) {
                    return response.data;
                });
        }
        
        function followUser(userId1 ,userId2) {
            return $http.get("api/user/follow/"+userId1+"/"+userId2);
        }

        function unfollowUser(userId1 ,userId2) {
            return $http.get("api/user/unfollow/"+userId1+"/"+userId2);
        }

        function isFollowing(userId1 , userId2) {
            return $http.get("api/user/isfollowing/"+userId1+"/"+userId2);
        }

        function findFollowersById(userId) {
            return $http.get("/api/user/followers/"+ userId)
        }

        function findFollowingById(userId) {
            return $http.get("/api/user/following/" + userId)
        }

        function searchUsers(inputQuery , userId) {
            return $http.get("/api/searchUsers/" + inputQuery + "/" + userId);
        }
        function searchNonAdminUsers(inputQuery) {
            return $http.get("/api/NonAdminUsers/" + inputQuery);
        }

        function forgotPasswordEmail(emailAddress) {
            return $http.get("/api/user/forgotPassword/" + emailAddress);
        }

        function findAllAlbums(userId) {
            console.log("user id is" + userId);
            return $http.get("/api/user/album/"+userId);
        }

       function findAllplayListAndFollowing(userId1 ,userId2) {
           return $http.get("/api/user/follow/playList/"+userId1 + "/" + userId2);
       }

        function findAllplayList(userId) {
            console.log("user id is" + userId);
            return $http.get("/api/user/playList/"+ userId);
        }

        function createUser(user) {
            return $http.post("/api/user", user);

        }

        function deleteUser(userId ) {
            return $http.delete("/api/user/"+userId);
        }

        function findUserById(userId) {
            return $http.get("/api/user/" + userId);
        }

        function findUserByCredentials(username , password) {
            // calling the api on the server tp fetch data from the server
            // rather that from the local instance
            var user ={
                username: username,
                password: password
            };
            return $http.post("/api/user/login",user);
        }

        function updateUser(userId , newUser) {
            // new user is the payload which is passed to the server
            return $http.put("/api/user/"+userId ,newUser)
        }

    }
})();
