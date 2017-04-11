(function() {

    angular
        .module("WebDevMusicApp")
        .controller("SingerProfileController",SingerProfileController);

    function SingerProfileController ($location, UserService ,$routeParams,StaticDataService ,$timeout) {

        var vm = this;


        function init() {
        console.log('Singer Profile Page controller');
        }
        init();

    }

})();