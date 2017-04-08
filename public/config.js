(function() {

    angular
        .module("WebDevMusicApp")
        .config(configuration);
    function configuration($routeProvider,$httpProvider) {


        $httpProvider.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
        $httpProvider.defaults.headers.put['Content-Type'] = 'application/json;charset=utf-8';

        $routeProvider
            .when("/", {
                templateUrl:"/views/music/templates/musicsearch.view.client.html",
                controller:"MusicRecSearchController",
                controllerAs:"model",
                data: {
                    pageTitle: 'Search Music',
                }
            })
            .when("/landingPage", {
                templateUrl:"/views/user/templates/landingPage.view.client.html",
                controller:"LandingPageController",
                controllerAs:"model",
                data: {
                    pageTitle: 'My Music',
                }
            })
            .when("/user/userHomePage", {
                templateUrl:"/views/user/templates/homePage.view.client.html",
                controller:"HomePageController",
                controllerAs:"model",
                data: {
                    pageTitle: 'Home Page',
                }
            })
            .when("/user/userHomePageSinger/:uid", {
                templateUrl:"/views/user/templates/homePageSingerCompany.view.client.html",
                controller:"HomePageSingerController",
                controllerAs:"model",
                data: {
                    pageTitle: 'Home Page',
                }
            })
            .when("/login", {
                templateUrl:"/views/user/templates/login.view.client.html",
                controller:"LoginController",
                controllerAs:"model",
                data: {
                    pageTitle: 'User Login',
                }
            })
            .when("/signup", {
                templateUrl:"/views/user/templates/signup.view.client.html",
                controller:"SignUpController",
                controllerAs:"model",
                data: {
                    pageTitle: 'New User Signup',
                }
            })
            .when("/user/forgotPassword", {
                templateUrl:"/views/user/templates/forgotpassword.view.client.html",
                controller:"ForgotPasswordController",
                controllerAs:"model",
                data: {
                    pageTitle: 'Forgot Password',
                }
            })
            .when("/music/playlist", {
                templateUrl:"/views/playlists/templates/playlist.view.client.html",
                controller:"PlayListController",
                controllerAs:"model",
                data: {
                    pageTitle: 'Play playlist',
                }
            })
            .when("/music/myplaylists", {
                templateUrl:"/views/playlists/templates/allplaylists.view.client.html",
                controller:"AllPlayListController",
                controllerAs:"model",
                data: {
                    pageTitle: 'My playlists',
                }
            })
            .when("/user/:uid/album/:aid/songs", {
                templateUrl:"/views/musiccompany/templates/musiclist.view.client.html",
                controller:"SongsInAlbums",
                controllerAs:"model",
                data: {
                    pageTitle: 'My playlists',
                }
            })
            .otherwise({
                redirectTo:"/"
            });
    }
})();