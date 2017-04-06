/**
 * Created by sumitbhanwala on 3/28/17.
 */
(function() {
    angular
        .module("WebDevMusicApp")
        .controller("EntryController",EntryController);

    function EntryController ($routeParams, $location) {
        var vm = this;
        vm.loginPage = loginPage ;
        vm.signupPage = signupPage ;
        function init() {
            $('#myCarousel').carousel();
        }
        init();

        function loginPage () {
            $location.url("/login");
        };

        function signupPage () {
            $location.url("/signup");
        };
    }

})();