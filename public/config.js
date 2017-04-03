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
            .otherwise({
                redirectTo:"/"
            });
    }
})();