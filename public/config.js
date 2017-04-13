(function() {

    angular
        .module("WebDevMusicApp")
        .config(configuration);
    function configuration($routeProvider,$httpProvider) {


        $httpProvider.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
        $httpProvider.defaults.headers.put['Content-Type'] = 'application/json;charset=utf-8';

        $routeProvider
            .when("/", {
                templateUrl:"/views/user/templates/landingPage.view.client.html",
                controller:"LandingPageController",
                controllerAs:"model",
                data: {
                    pageTitle: 'My Music'
                }
            })
            .when("/landingPage", {
                templateUrl:"/views/user/templates/landingPage.view.client.html",
                controller:"LandingPageController",
                controllerAs:"model",
                data: {
                    pageTitle: 'My Music'
                }
            })
            .when("/user/userHomePage/:uid", {
                templateUrl:"/views/user/templates/homePage.view.client.html",
                controller:"HomePageController",
                controllerAs:"model",
                data: {
                    pageTitle: 'Home Page'
                }
            })
            .when("/user/singerProfile", {
                templateUrl:"/views/user/templates/singerProfilePage.view.client.html",
                controller:"SingerProfileController",
                controllerAs:"model",
                data: {
                    pageTitle: 'View Profile'
                }
            })
            .when("/user/userSearch/playList/songs/:pid", {
                templateUrl:"/views/playlists/templates/playlistaddsong.view.client.html",
                controller:"PlayListAddSongController",
                controllerAs:"model",
                data: {
                    pageTitle: 'Viewing playlist and add song'
                }
            })
            .when("/user/userProfile", {
                templateUrl:"/views/user/templates/userProfilePage.view.client.html",
                controller:"UserProfileController",
                controllerAs:"model",
                data: {
                    pageTitle: 'View Profile'
                }
            })
            .when("/user/userHomePageSinger/:uid", {
                templateUrl:"/views/user/templates/homePageSingerCompany.view.client.html",
                controller:"HomePageSingerController",
                controllerAs:"model",
                data: {
                    pageTitle: 'Home Page'
                }
            })
            .when("/user/editProfile/:uid", {
                templateUrl:"/views/user/templates/editprofile.view.client.html",
                controller:"EditProfileController",
                controllerAs:"model",
                data: {
                    pageTitle: 'Edit Profile'
                }
            })
            .when("/login", {
                templateUrl:"/views/user/templates/login.view.client.html",
                controller:"LoginController",
                controllerAs:"model",
                data: {
                    pageTitle: 'User Login'
                }
            })
            .when("/signup", {
                templateUrl:"/views/user/templates/signup.view.client.html",
                controller:"SignUpController",
                controllerAs:"model",
                data: {
                    pageTitle: 'New User Signup'
                }
            })
            .when("/user/forgotPassword", {
                templateUrl:"/views/user/templates/forgotpassword.view.client.html",
                controller:"ForgotPasswordController",
                controllerAs:"model",
                data: {
                    pageTitle: 'Forgot Password'
                }
            })
            .when("/user/userSearch/:uidP/:uidS", {
                templateUrl:"/views/user/templates/userProfilePage.view.client.html",
                controller:"UserProfileController",
                controllerAs:"model",
                data: {
                    pageTitle: 'Searched User'
                }
            })
            .when("/user/singerSearch", {
                templateUrl:"/views/user/templates/singerProfilePage.view.client.html",
                controller:"SingerProfileController",
                controllerAs:"model",
                data: {
                    pageTitle: 'Searched Singer/Music Company'
                }
            })
            .when("/user/followers/:uid", {
                templateUrl:"/views/user/templates/followers.view.client.html",
                controller:"FollowerController",
                controllerAs:"model",
                data: {
                    pageTitle: 'My Followers'
                }
            })
            .when("/user/following/:uid", {
                templateUrl:"/views/user/templates/following.view.client.html",
                controller:"FollowingController",
                controllerAs:"model",
                data: {
                    pageTitle: 'Following'
                }
            })
            .when("/music/playlist", {
                templateUrl:"/views/playlists/templates/playlist.view.client.html",
                controller:"PlayListController",
                controllerAs:"model",
                data: {
                    pageTitle: 'Play playlist'
                }
            })
            .when("/music/myplaylists/:uid", {
                templateUrl:"/views/playlists/templates/allplaylists.view.client.html",
                controller:"AllPlayListController",
                controllerAs:"model",
                data: {
                    pageTitle: 'My Playlists'
                }
            })
            .when("/user/:uid/album/:aid/songs", {
                templateUrl:"/views/musiccompany/templates/musiclist.view.client.html",
                controller:"SongsInAlbums",
                controllerAs:"model",
                data: {
                    pageTitle: 'My playlists'
                }
            })

            .when("/landingPage/forgetpass", {
                templateUrl:"/views/user/templates/forgotpassword.view.client.html",
                controller:"ForgotPasswordController",
                controllerAs:"model",
                data: {
                    pageTitle: 'Forgot password'
                }})
            .when("/music/recordAndSearch/:uid", {
                templateUrl:"/views/music/templates/musicRecordSearch.view.client.html",
                controller:"MusicRecorderController",
                controllerAs:"model",
                data: {
                    pageTitle: 'Record and Search'

                }
            })
            .otherwise({
                redirectTo:"/"
            });
    }
})();