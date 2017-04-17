/**
 * Created by sumitbhanwala on 4/9/17.
 */
(function() {
    angular
        .module("WebDevMusicApp")
        .controller("EditProfileController", EditProfileController);

    function EditProfileController ($location ,currentUser,$routeParams ,UserService ,Upload) {
        var vm = this;
        vm.userId = currentUser._id;
        vm.saveChanges = saveChanges ;
        vm.closeAlert = closeAlert;
        function init() {
            var promise = UserService.findUserById(vm.userId);
            promise.success(function(response) {
                vm.user = response.data;
                console.log(vm.user);
               // console.log(user);
                if(!vm.user.imageURL)
                {
                    vm.user.imageURL = "";
                }

            }).error(function (user) {
                vm.error = "User Not found";
            })
        }
        init();
        function closeAlert() {
            vm.error=null;
            vm.success=null;
        }
        function saveChanges() {
            // first we will upload the song to the AWS and if it is uploaded correctly than
            // only we will save the remaining changes of the user to the user database and
            // if any of the step fails than we will abort the entire process from the scratch

            if(vm.file)
            {
                Upload.upload({
                url: '/api/image/uploadImage', // web api which will handle the data
                data:{
                    userId : vm.userId,
                    file:vm.file
                } //pass file as data, should be user ng-model
            }).then(function (data) {
                vm.user.imageURL = data.data.URL ;
                var promise =  UserService.updateUser(vm.userId ,vm.user);
                promise.success (function (user) {
                    vm.user = user ;
                    vm.success="User successfully updated";
                    init();
                }).error(function (err) {
                    vm.error = "Some Error Occurred!! Please try again!";
                });
            },function (err) {
                vm.error = "Some Error Occurred!! Please try again!";
            });
            }
            else
            {
                var promise =  UserService.updateUser(vm.userId ,vm.user);
                promise.success (function (user) {
                    vm.user = user ;
                    vm.success="User successfully updated";
                    init();
                }).error(function (err) {
                    vm.error = "Some Error Occurred!! Please try again!";
                });
            }

        }
    }
})();