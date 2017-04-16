(function() {

    angular
        .module("WebDevMusicApp")
        .config(configuration);
    function configuration($routeProvider,$httpProvider) {
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
        $httpProvider.defaults.headers.put['Content-Type'] = 'application/json;charset=utf-8';

        $routeProvider
            .when("/", {
                templateUrl:"/views/user/templates/landingPage.view.client.html",
                controller:"LandingPageController",
                controllerAs:"model",
                data: {
                    pageTitle: 'My Music'
                }
            })
            .when("/landingPage", {
                templateUrl:"/views/user/templates/landingPage.view.client.html",
                controller:"LandingPageController",
                controllerAs:"model",
                data: {
                    pageTitle: 'My Music'
                }
            })
            .when("/user/userHomePage", {
                templateUrl:"/views/user/templates/homePage.view.client.html",
                resolve : {
                    currentUser : checkLoggedIn
                },
                controller:"HomePageController",
                controllerAs:"model",
                data: {
                    pageTitle: 'Home Page'
                }
            })
            .when("/user/userHomeEventOrg", {
                templateUrl:"/views/user/templates/homePageEventOrganiser.view.client.html",
                resolve : {
                    currentUser : checkLoggedIn
                },
                controller:"EventOrgController",
                controllerAs:"model",
                data: {
                    pageTitle: 'HomePage'
                }
            })
            // not sure if we need the below two controller as they seems redundant
            // .when("/user/singerProfile", {
            //     templateUrl:"/views/user/templates/singerProfilePage.view.client.html",
            //     controller:"SingerProfileController",
            //     controllerAs:"model",
            //     data: {
            //         pageTitle: 'View Profile'
            //     }
            // })
            // .when("/user/userProfile", {
            //     templateUrl:"/views/user/templates/userProfilePage.view.client.html",
            //     controller:"UserProfileController",
            //     controllerAs:"model",
            //     data: {
            //         pageTitle: 'View Profile'
            //     }
            // })
         // not sure if we need the above two controller as they seems redundant
            .when("/user/userHomePageSinger", {
                templateUrl:"/views/user/templates/homePageSingerCompany.view.client.html",
                resolve : {
                    currentUser : checkLoggedIn
                },
                controller:"HomePageSingerController",
                controllerAs:"model",
                data: {
                    pageTitle: 'Home Page'
                }
             })
            // admin still to be mapped to the session in a better way
            .when("/user/adminHomePage", {
                templateUrl:"/views/user/templates/adminHomepage.view.client.html",
                resolve: {
                    adminUser: checkAdmin
                },
                controller:"adminPageController",
                controllerAs:"model",
                data: {
                    pageTitle: 'Home Page Admin'
                }
            })
            .when("/user/userSearch/playList/songs/:pid", {
                templateUrl:"/views/playlists/templates/playlistaddsong.view.client.html",
                controller:"PlayListAddSongController",
                controllerAs:"model",
                data: {
                    pageTitle: 'Viewing playlist and add song'
                }
            })
            .when("/user/editProfile", {
                templateUrl:"/views/user/templates/editprofile.view.client.html",
                resolve : {
                    currentUser : checkLoggedIn
                },
                controller:"EditProfileController",
                controllerAs:"model",
                data: {
                    pageTitle: 'Edit Profile'
                }
            })
            .when("/signup", {
                templateUrl:"/views/user/templates/signup.view.client.html",
                controller:"SignUpController",
                controllerAs:"model",
                data: {
                    pageTitle: 'New User Signup'
                }
            })
            .when("/user/forgotPassword", {
                templateUrl:"/views/user/templates/forgotpassword.view.client.html",
                controller:"ForgotPasswordController",
                controllerAs:"model",
                data: {
                    pageTitle: 'Forgot Password'
                }
            })
            .when("/user/userSearch/:uidS", {
                templateUrl:"/views/user/templates/userProfilePage.view.client.html",
                resolve : {
                    currentUser : checkLoggedIn
                },
                controller:"UserProfileController",
                controllerAs:"model",
                data: {
                    pageTitle: 'View Profile'
                }
            })
            .when("/user/singerSearch/:uidS", {
                templateUrl:"/views/user/templates/singerProfilePage.view.client.html",
                resolve : {
                    currentUser : checkLoggedIn
                },
                controller:"SingerProfileController",
                controllerAs:"model",
                data: {
                    pageTitle: 'View Profile'
                }
            })
            .when("/user/followers", {
                templateUrl:"/views/user/templates/followers.view.client.html",
                resolve : {
                    currentUser : checkLoggedIn
                },
                controller:"FollowerController",
                controllerAs:"model",
                data: {
                    pageTitle: 'My Followers'
                }
            })
            .when("/user/following", {
                templateUrl:"/views/user/templates/following.view.client.html",
                resolve : {
                    currentUser : checkLoggedIn
                },
                controller:"FollowingController",
                controllerAs:"model",
                data: {
                    pageTitle: 'Following'
                }
            })
            .when("/user/playlist/songs/:playListId", {
                templateUrl:"/views/playlists/templates/playlist.view.client.html",
                resolve : {
                    currentUser : checkLoggedIn
                },
                controller:"PlayListController",
                controllerAs:"model",
                data: {
                    pageTitle: 'Play playlist'
                }
            })
            .when("/user/userSearch/playList/songs/:uid/:playListId", {
                templateUrl:"/views/playlists/templates/playlist.view.client.html",
                resolve : {
                    currentUser : checkLoggedIn
                },
                controller:"PlayListController",
                controllerAs:"model",
                data: {
                    pageTitle: 'Play playlist'
                }
            })
            .when("/music/myalbums", {
                templateUrl:"/views/albums/templates/allalbums.view.client.html",
                resolve : {
                    currentUser : checkLoggedIn
                },
                controller:"AllAlbumListController",
                controllerAs:"model",
                data: {
                    pageTitle: 'My albums'
                }
            })
            .when("/music/myplaylists", {
                templateUrl:"/views/playlists/templates/allplaylists.view.client.html",
                resolve : {
                    currentUser : checkLoggedIn
                },
                controller:"AllPlayListController",
                controllerAs:"model",
                data: {
                    pageTitle: 'My Playlists'
                }
            })
            .when("/user/singer/album/songs/:aid", {
                templateUrl:"/views/albums/templates/albumsongs.view.client.html",
                resolve : {
                    currentUser : checkLoggedIn
                },
                controller:"SongsInAlbums",
                controllerAs:"model",
                data: {
                    pageTitle: 'My Songs'
                }
            })
            .when("/user/singer/album/songs/:uid/:aid", {
                templateUrl:"/views/albums/templates/albumsongs.view.client.html",
                resolve : {
                    currentUser : checkLoggedIn
                },
                controller:"SongsInAlbums",
                controllerAs:"model",
                data: {
                    pageTitle: 'Album songs'
                }
            })
            // .when("/user/:uid/album/:aid/songs", {
            //     templateUrl:"/views/musiccompany/templates/musiclist.view.client.html",
            //     controller:"SongsInAlbums",
            //     controllerAs:"model",
            //     data: {
            //         pageTitle: 'My playlists'
            //     }
            // })
            .when("/landingPage/forgetpass", {
                templateUrl:"/views/user/templates/forgotpassword.view.client.html",
                controller:"ForgotPasswordController",
                controllerAs:"model",
                data: {
                    pageTitle: 'Forgot password'
                }})
            .when("/music/recordAndSearch", {
                templateUrl:"/views/music/templates/musicRecordSearch.view.client.html",
                controller:"MusicRecorderController",
                resolve : {
                    currentUser : checkLoggedIn
                },
                controllerAs:"model",
                data: {
                    pageTitle: 'Record and Search'

                }
            })
            .when("/events/upcomingEvents", {
                templateUrl:"/views/events/templates/allEvents.view.client.html",
                resolve : {
                    currentUser : checkLoggedIn
                },
                controller:"UpcomingEventsController",
                controllerAs:"model",
                data: {
                    pageTitle: 'Upcoming Events'
                }
            })
            .otherwise({
                redirectTo:"/"
            });
    }

    function checkLoggedIn($q ,UserService ,$location ,$timeout) {
        var defer =  $q.defer();
        UserService
            .loggedin()
            .then(function (user) {
                if (user == '0') {
                    $('.modal').modal('hide');
                    $timeout(function () {
                    }, 350);
                    defer.reject();
                    $location.url('/landingPage');
                }
                else
                {
                    defer.resolve(user);
                }
            });
        return defer.promise;
    }

    function checkAdmin($q ,UserService ,$location ,$timeout) {
        var defer =  $q.defer();
        UserService
            .isAdmin()
            .then(function (user) {
                if (user == '0') {
                    $('.modal').modal('hide');
                    $timeout(function () {
                    }, 350);
                    defer.reject();
                    $location.url('/landingPage');
                }
                else
                {
                    defer.resolve(user);
                }
            });
        return defer.promise;
    }

})();