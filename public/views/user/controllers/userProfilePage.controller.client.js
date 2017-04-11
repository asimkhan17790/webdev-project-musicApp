(function() {

    angular
        .module("WebDevMusicApp")
        .controller("UserProfileController",UserProfileController);

    function UserProfileController ($location, UserService ,$routeParams,StaticDataService ,$timeout) {

        var vm = this;

        function init() {

        }
        init();
    }

})();