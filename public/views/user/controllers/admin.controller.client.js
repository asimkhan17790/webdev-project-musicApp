/**
 * Created by sumitbhanwala on 4/14/17.
 */
(function() {

    angular
        .module("WebDevMusicApp")
        .run(function($rootScope, $uibModalStack) {
            $uibModalStack.dismissAll();
        })
        .controller("adminPageController",adminPageController);

    function adminPageController ($scope,EventService ,$sce,UserService ,$routeParams ,MusicService,$timeout,playListService,$location) {
        var vm = this;
        vm.userId = $routeParams.uid ;
        vm.editProfile = editProfile ;
        vm.error = null;
        vm.getTrsustedURL = getTrsustedURL;
        vm.searchUsers = searchUsers ;
        vm.clearUserFromModal  = clearUserFromModal;
        vm.redirectToSearchedUser  = redirectToSearchedUser
        function init() {
            getUserDetails ();
        }
        init();

        function clearUserFromModal() {
            vm.users = null;
            vm.error = null;
            vm.inputQuery = null;
        }


        // most probably wont need this or will be redirecting to the edit profile
        // page for the function as we wont be taking to the particular user
        function redirectToSearchedUser(userId2) {
            var promise = UserService.findUserById(userId2);
            promise.success (function (result) {
                if (result && result.status==='OK' && result.data) {
                    var searchedUser = result.data;
                    closeModal();
                    $timeout(function () {
                        if(searchedUser.userType == 'U')
                            $location.url("/user/userSearch/"+vm.userId+"/"+userId2);
                        else if(searchedUser.userType == 'M')
                        {
                            $location.url("/user/singerSearch/"+vm.userId+"/"+userId2);
                        }
                    }, 250);
                    vm.error = null;
                } else {
                    vm.error = "Some Error Occurred!! Please try again!";
                }
            }).error(function () {
                vm.error = "Some Error Occurred!! Please try again!";
            });
        }


        function searchUsers () {
            console.log(vm.inputQuery);
            var promise = UserService.searchNonAdminUsers(vm.inputQuery);
            promise.success (function (result) {
                if (result && result.status==='OK' && result.data && result.data.length >0) {
                    vm.users = result.data;
                    vm.error = null;
                } else {
                    vm.users = null;
                    vm.error = "No user found !!";
                }
            }).error(function () {
                vm.users = null;
                vm.error = "Some Error Occurred!! Please try again!";
            });
        }

        function getUserDetails() {
            var promise = UserService.findUserById(vm.userId);
            promise.success (function (result) {
                if (result && result.status==='OK' && result.data) {
                    vm.user = result.data;
                    vm.error = null;
                } else {
                    vm.error = "Some Error Occurred!! Please try again!";
                }

            }).error(function () {
                vm.error = "Some Error Occurred!! Please try again!";
            });
        }

        function editProfile() {
            $location.url("/user/editProfile/"+vm.userId);
        }

        function closeModal() {
            $('.modal').modal('hide');
        }


        function getTrsustedURL (url) {
            return  $sce.trustAsResourceUrl(url);
        }
    }

})();