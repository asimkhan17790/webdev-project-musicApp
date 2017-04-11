/**
 * Created by sumitbhanwala on 4/9/17.
 */
(function() {
    angular
        .module("WebDevMusicApp")
        .controller("EditProfileController", EditProfileController);

    function EditProfileController ($location ,$routeParams ,UserService) {
        var vm = this;
        var userId = $routeParams['uid'];
        vm.saveChanges = saveChanges ;
        function init() {
            var promise = UserService.findUserById(userId);
            promise.success(function(user) {
                vm.user = user;
                vm.userId = userId ;
                if(!user.imageURL)
                {
                    user.imageURL = ""
                }

            })
            promise.error(function (user) {
                vm.error = "User Not found";
            })
        }
        init();

        function saveChanges() {
            console.log(vm.user);
        }
    }
})();