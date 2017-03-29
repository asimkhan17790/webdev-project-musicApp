(function() {

    angular
        .module("WebDevMusicApp")
        .config(configuration);
    function configuration($routeProvider,$httpProvider) {

        $httpProvider.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
        $httpProvider.defaults.headers.put['Content-Type'] = 'application/json;charset=utf-8';

        $routeProvider
            .when("/", {
                templateUrl:"/views/entrypage/templates/entry.view.client.html",
                controller:"EntryController",
                controllerAs:"model",
                data: {
                    pageTitle: 'Welcome to the Music searching engine',
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
            .otherwise({
                redirectTo:"/"
            });
    }
})();