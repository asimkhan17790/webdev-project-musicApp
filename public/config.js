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
            .otherwise({
                redirectTo:"/"
            });
    }
})();