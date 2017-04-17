(function() {

    angular
        .module("WebDevMusicApp")
        .run(function($rootScope, $uibModalStack) {
            $uibModalStack.dismissAll();
        })
        .controller("SongDetailsController", SongDetailsController);

    function SongDetailsController ($location,playListService ,UserService,currentUser, $sce,$timeout,Upload,MusicService,$routeParams) {

        var vm = this;
        vm.userId = currentUser._id;
        vm.songId = $routeParams.songId ;
        vm.getTrustedHtml = getTrustedHtml;
        vm.showSpinner = showSpinner;
        vm.findLyrics = findLyrics;
        vm.closeAlert = closeAlert;
        vm.loadAllMyList = loadAllMyList ;
        vm.addSongToMyPlaylist = addSongToMyPlaylist;
        vm.addSongToFavorites = addSongToFavorites;
        vm.availablePlaylist = null;
        vm.selectedSong = null;
        vm.songSaveError = null;
        vm.songSaveSuccess = null;
        vm.addedToFav = null;
        vm.favError = null;
        vm.favSuccess = null;
        vm.getTrustedURL = getTrustedURL;
        vm.logout = logout ;
        vm.checkoutSongInFav = checkoutSongInFav;
        vm.clearDataFromModal = clearDataFromModal;

        function init() {
            getUserDetails();
            findSongById();
            angular.element(document).ready(function () {
                $('[data-toggle="tooltip"]').tooltip({animation: true});
            });
        }
        function getTrustedURL (url) {
            return  $sce.trustAsResourceUrl(url);
        }
        init();

        function checkoutSongInFav(favorite,songId) {
            var promise = playListService.checkSongInPlayList(favorite,songId);
            promise.success(function(response) {

                if (response && response.status === 'YES') {
                    vm.addedToFav = true;
                }
                else {
                    vm.addedToFav = false;
                }

            }).error(function (err) {
                vm.error = "Some Error Occurred";
            })
        }

        function findSongById () {

            var promise = MusicService.findSongById(vm.songId);
            promise.success(function(response) {
                vm.music = response.data;
                console.log(vm.music);
                vm.music.songURL =  $sce.trustAsResourceUrl(vm.music.songURL);

            }).error(function (err) {
                vm.error = "Some Error Occurred";
            })
        }

        function closeModal() {
            vm.songSaveError = null;
            vm.songSaveSuccess = null;
            vm.favError = null;
            vm.favSuccess = null;
            $('.modal').modal('hide');
        }

        function addSongToFavorites() {
            if (!vm.addedToFav) {
             //   vm.music.songURL = angular.copy(vm.music.songURL.$$unwrapTrustedValue());
                var promise  = playListService.addSongtoPlayList(vm.music._id,vm.favorite);
                promise.success(function (result) {
                    if (result && result.status === 'OK') {
                        if (result.description) {
                            vm.favSuccess = result.description;
                            vm.favError = null;
                        }
                        else {
                            vm.favSuccess = "Song Successfully Added!!";
                            vm.favError = null;
                        }
                        vm.addedToFav = true;
                        $timeout(function () {
                            vm.favSuccess = null;
                            vm.favError = null;
                        }, 1000);

                    } else {
                        if (result.description) {
                            vm.favError = result.description;
                        }else {
                            vm.favError = "Some Error Occurred";
                        }
                        vm.favSuccess = null;
                        $timeout(function () {
                            vm.favSuccess = null;
                            vm.favError = null;
                        }, 1000);
                    }

                }).error(function (err) {
                    vm.favError = "Some Error Occurred";
                    vm.favSuccess = null;
                    $timeout(function () {
                        vm.favSuccess = null;
                        vm.favError = null;
                    }, 1000);
                });
            }
        }



        function logout() {
            UserService
                .logout()
                .then(function () {
                    $location.url('/landingPage');
                });
        }

        function addSongToMyPlaylist(selectedPlayList) {

            var promise  = playListService.addSongtoPlayList(vm.music._id,selectedPlayList._id);
            promise.success(function (result) {
                if (result && result.status === 'OK') {
                    if (result.description) {
                        vm.songSaveSuccess = result.description;
                        vm.songSaveError = null;
                    }
                    else {
                        vm.songSaveSuccess = "Song Successfully Added!!";
                        vm.songSaveError = null;

                    }
                    $timeout(function () {
                        closeModal();
                        init();
                    }, 500);

                } else {

                        if (result.description) {
                            vm.songSaveError = result.description;
                        }else {
                            vm.songSaveError = "Some Error Occurred";
                        }
                        vm.songSaveSuccess = null;
                        $timeout(function () {
                            vm.songSaveSuccess = null;
                            vm.songSaveError = null;
                        }, 1000);


                }

            }).error(function (err) {
                vm.songSaveError = "Some Error Occurred";
                vm.songSaveSuccess = null;
            });
        }

        function loadAllMyList() {
            if(vm.userId != null)
            {
                var promise  = UserService.findAllplayList(vm.userId);
                promise.success(function (user) {
                    vm.availablePlaylist = user.data ;
                    console.log(vm.availablePlaylist);

                }).error(function (err) {
                    console.log("some error occured " + err);
                    vm.availablePlaylist = null ;
                });
            }
        }
        function clearDataFromModal() {
            vm.songSaveError = null;
            vm.songSaveSuccess = null;
            vm.favError = null;
            vm.favSuccess = null;

        }

        function closeAlert() {
            vm.error=null;
        }
        function showSpinner() {
            if (!vm.recordingFlag) {
                vm.recordingFlag = true;
            }
            return true;
        }

        function getTrustedHtml(html) {
            return $sce.trustAsHtml(html);
        }




        function getUserDetails() {
            var promise = UserService.findUserById(vm.userId);
            promise.success (function (result) {
                if (result && result.status==='OK' && result.data) {
                    vm.followers = result.data.followers.length ;
                    vm.following = result.data.following.length ;
                    vm.error = null;
                    vm.favorite = result.data.favPlayList;
                    checkoutSongInFav(vm.favorite,vm.songId);
                } else {
                    vm.error = "Some Error Occurred!! Please try again!";
                }

            }).error(function () {
                vm.error = "Some Error Occurred!! Please try again!";
            });
        }

        function findLyrics (songTitle, artists) {
            console.log(artists[0]);
            if (songTitle && artists && artists[0] != null) {
                var promise =  MusicService.searchLyrics(songTitle, artists[0]);
                promise.success(function (data) {
                    if (data.message && data.message.header
                        && data.message.header.status_code && data.message.header.status_code === 200
                    && data.message.body.lyrics && data.message.body.lyrics.lyrics_body) {
                        //console.log(data.message.body.lyrics.lyrics_body);
                        vm.lyricsData = data.message.body.lyrics.lyrics_body;
                        console.log(vm.lyricsData);
                    }
                    else {
                        console.log("No Data Found");
                        vm.lyricsData =null;
                        vm.error = "Lyrics does not exist in Database";
                    }
                })
                    .error(function () {
                        vm.error = "Error Occurred";
                        vm.lyricsData =null;
                    });
            }
            else {
                console.log("No input Data");
            }

        }

    }

})();