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

    function adminPageController ($scope,EventService, adminUser,StaticDataService ,$sce,UserService ,$routeParams ,MusicService,$timeout,playListService,$location)
    {
        var vm = this;
        vm.userId = adminUser._id;
        vm.editProfile = editProfile ;
        vm.userOptionsad = StaticDataService.userTypeOptions;
        vm.error = null;
        vm.getTrsustedURL = getTrsustedURL;
        vm.searchUsers = searchUsers ;
        vm.clearUserFromModal  = clearUserFromModal;
      //  vm.selectUserToDelete = selectUserToDelete ;
        vm.deleteUser = deleteUser ;
        vm.editUser = editUser ;
        vm.redirectToSearchedUser  = redirectToSearchedUser;
        vm.createUser = createUser ;
        vm.openEditModalFromAdmin = openEditModalFromAdmin ;
        vm.saveChanges = saveChanges ;
        vm.toEditUser ;
        vm.logout = logout ;
        function init() {
            getUserDetails ();
            vm.userad={};
            vm.userTypead =  vm.userOptionsad[0];
        }
        init();


        function logout() {
            UserService
                .logout()
                .then(function () {
                    $location.url('/landingPage');
                });
        }

        function saveChanges() {
            var promise =  UserService.updateUser(vm.toEditUser._id ,vm.toEditUser);
            promise.success (function (user) {
                vm.user = user ;
                vm.successEdit="User successfully updated";
                $timeout(function () {
                    vm.successEdit = null ;
                    $('#editUserModal').modal('hide');
                }, 500);
            }).error(function (err) {
                vm.errorEdit = "Some Error Occurred!! Please try again!";
            });
        }

        function openEditModalFromAdmin(user) {
            vm.toEditUser = user ;
            $('#profileSearchModal').modal('hide');
            $timeout(function () {
                $('#editUserModal').modal('show');
            }, 500);
        }

        function clearUserFromModal() {
            vm.users = null;
            vm.error = null;
            // we have to clear modal here to but cant use vm.user as vm.user is already bind to the
            vm.inputQuery = null;
            vm.userad = null;
        }

        function deleteUser(user) {
            console.log(user);
                var promise = UserService.deleteUser(user._id);
                promise.success(function (response) {
                    if (response && response==='OK') {
                        vm.success = "User deleted successfully";
                        vm.error= null;
                        $timeout(function () {
                            closeModal();
                            vm.success = null;
                            // again fetch that list for the particular search entry
                            searchUsers();
                        }, 550);
                    }
                    else {
                        vm.error= "Some error occurred";
                        vm.success = null;
                    }
                }).error(function (err) {
                    vm.error = "Some Error Occurred!!";
                });
        }

        function editUser(user) {
                var promise = UserService.updateUser(user._id);
                promise.success(function (response) {
                    if (response) {
                        if (response.status === "OK" && response.data) {
                            vm.success = "User updated successfully";
                            vm.error= null;
                            $timeout(function () {
                                closeModal();
                                searchUsers ();
                            }, 550);
                        }
                        else {
                            if (response.description) {
                                vm.error= response.description;
                            }else {
                                vm.error = "Some error occurred";
                            }
                            vm.success = null;
                        }
                    }
                    else {
                        vm.error= "Some error occurred";
                        vm.success = null;
                    }
                }).error(function (err) {
                    vm.error = "Some Error Occurred!!";
                });;
        }

        function createUser() {
            vm.userad.userType = vm.userTypead.userType;
            var promise = UserService.createUser(vm.userad);
            promise.success(function (response) {
                    //console.log(response.user);
                    if (response.status && response.status==='OK') {
                        if(response.user){
                            closeModal();
                            $timeout(function () {
                            }, 250);
                        } else {
                            vm.errorad = "Some Error Occurred!! Please try again.";
                        }
                    }
                    else {
                        if (response.description) {
                            vm.errorad = response.description;
                        } else {
                            vm.errorad = "Some Error Occurred!! Please try again.";
                        }
                    }
                }
            ).error(function (err) {
                if (err && err.description) {
                    vm.errorad = err.description;
                }
                else {
                    vm.errorad = "Some Error Occurred!!"
                }
            })
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
            vm.userad = null;
        }


        function getTrsustedURL (url) {
            return  $sce.trustAsResourceUrl(url);
        }
    }

})();